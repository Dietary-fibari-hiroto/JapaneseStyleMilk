import { main } from '../../gemini/geminiApi';
import { LogicEvaluation, CompositionEvaluation, RebuttalEvaluation, EnglishEvaluation, GeneralEvaluation } from '../models/evaluation';
import { EvaluationRequestDTO, EvaluationResponseDTO } from '../models/evaluation';

export class EvaluationService {
  // ディベート内容を評価する
  async evaluateDebate(evaluationData: EvaluationRequestDTO): Promise<EvaluationResponseDTO> {
    try {
      // Gemini APIに送信するプロンプトを作成
      const prompt = this.createEvaluationPrompt(evaluationData);
      
      // Gemini APIから評価結果を取得
      const aiResponse = await main(prompt);
      
      // AIの応答をパースして評価結果を取得
      const evaluationResult = this.parseAIResponse(aiResponse);
      
      // 評価結果をデータベースに保存
      await this.saveEvaluation(evaluationData.debate_history_id, evaluationResult);
      
      return evaluationResult;
    } catch (error) {
      console.error('ディベート評価エラー:', error);
      throw new Error('ディベートの評価に失敗しました');
    }
  }

  // 評価用のプロンプトを作成
  private createEvaluationPrompt(evaluationData: EvaluationRequestDTO): string {
    const { debate_topic, debate_texts } = evaluationData;
    
    // ディベートテキストを時系列で整理
    const sortedTexts = debate_texts.sort((a, b) => {
      if (a.turn_number !== b.turn_number) {
        return a.turn_number - b.turn_number;
      }
      return a.sequence_in_turn - b.sequence_in_turn;
    });

    // ディベート内容を文字列として構築
    const debateContent = sortedTexts.map(text => 
      `ターン${text.turn_number}-${text.sequence_in_turn}: ${text.text}`
    ).join('\n');

    return `
以下のディベート内容を評価してください。各項目を25点満点で採点し、総合力について2行程度の感想を述べてください。

【ディベート情報】
トピック: ${debate_topic}

【ディベート内容】
${debateContent}

【評価項目】
1. 英語力 (English Score): 0-25点
2. 構成力 (Composition Score): 0-25点  
3. 反論力 (Rebuttal Score): 0-25点
4. 論理性 (Logic Score): 0-25点
5. 総合力の感想 (General Feedback): 2行程度

以下のJSON形式で回答してください：
{
  "logic_score": 数値,
  "composition_score": 数値,
  "rebuttal_score": 数値,
  "english_score": 数値,
  "general_feedback": "2行程度の感想"
}

注意：
- 各スコアは0-25の整数で回答してください
- general_feedbackは2行程度の日本語で感想を述べてください
- JSON形式以外の回答は避けてください
`;
  }

  // AIの応答をパースして評価結果を取得
  private parseAIResponse(aiResponse: string): EvaluationResponseDTO {
    try {
      // JSON部分を抽出
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AIの応答からJSONを抽出できませんでした');
      }

      const evaluationData = JSON.parse(jsonMatch[0]);

      // 必須フィールドの検証
      const requiredFields = ['logic_score', 'composition_score', 'rebuttal_score', 'english_score', 'general_feedback'];
      for (const field of requiredFields) {
        if (!(field in evaluationData)) {
          throw new Error(`必須フィールド ${field} が不足しています`);
        }
      }

      // スコアの範囲チェック
      const scores = ['logic_score', 'composition_score', 'rebuttal_score', 'english_score'];
      for (const score of scores) {
        const value = evaluationData[score];
        if (typeof value !== 'number' || value < 0 || value > 25) {
          throw new Error(`${score} の値が無効です: ${value}`);
        }
      }

      return {
        logic: {
          score: evaluationData.logic_score,
          feedback: `論理性の評価: ${evaluationData.logic_score}/25点`
        },
        composition: {
          score: evaluationData.composition_score,
          feedback: `構成力の評価: ${evaluationData.composition_score}/25点`
        },
        rebuttal: {
          score: evaluationData.rebuttal_score,
          feedback: `反論力の評価: ${evaluationData.rebuttal_score}/25点`
        },
        english: {
          score: evaluationData.english_score,
          feedback: `英語力の評価: ${evaluationData.english_score}/25点`
        },
        general: {
          score: Math.floor((evaluationData.logic_score + evaluationData.composition_score + evaluationData.rebuttal_score + evaluationData.english_score) / 4),
          feedback: evaluationData.general_feedback
        }
      };
    } catch (error) {
      console.error('AI応答のパースエラー:', error);
      // フォールバック: デフォルト評価を返す
      return {
        logic: {
          score: 15,
          feedback: '論理性の評価: 15/25点'
        },
        composition: {
          score: 15,
          feedback: '構成力の評価: 15/25点'
        },
        rebuttal: {
          score: 15,
          feedback: '反論力の評価: 15/25点'
        },
        english: {
          score: 15,
          feedback: '英語力の評価: 15/25点'
        },
        general: {
          score: 15,
          feedback: '評価の処理中にエラーが発生しました。再度お試しください。'
        }
      };
    }
  }

  // 評価結果をデータベースに保存
  private async saveEvaluation(debateHistoryId: number, evaluationResult: EvaluationResponseDTO): Promise<void> {
    // トランザクションで一括保存
    await LogicEvaluation.sequelize!.transaction(async (t) => {
      await LogicEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationResult.logic.score,
          feedback: evaluationResult.logic.feedback,
        },
        { transaction: t }
      );

      await CompositionEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationResult.composition.score,
          feedback: evaluationResult.composition.feedback,
        },
        { transaction: t }
      );

      await RebuttalEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationResult.rebuttal.score,
          feedback: evaluationResult.rebuttal.feedback,
        },
        { transaction: t }
      );

      await EnglishEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationResult.english.score,
          feedback: evaluationResult.english.feedback,
        },
        { transaction: t }
      );

      await GeneralEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationResult.general.score,
          feedback: evaluationResult.general.feedback,
        },
        { transaction: t }
      );
    });
  }

  // ディベート履歴IDから評価結果を取得
  async getEvaluationByDebateHistoryId(debateHistoryId: number) {
    // 既存のhistory APIと同じ構造で評価結果を取得
    const logicEval = await LogicEvaluation.findOne({
      where: { debate_history_id: debateHistoryId }
    });
    const compositionEval = await CompositionEvaluation.findOne({
      where: { debate_history_id: debateHistoryId }
    });
    const rebuttalEval = await RebuttalEvaluation.findOne({
      where: { debate_history_id: debateHistoryId }
    });
    const englishEval = await EnglishEvaluation.findOne({
      where: { debate_history_id: debateHistoryId }
    });
    const generalEval = await GeneralEvaluation.findOne({
      where: { debate_history_id: debateHistoryId }
    });

    return {
      debate_history_id: debateHistoryId,
      evaluations: {
        logic: logicEval ? {
          score: logicEval.score,
          feedback: logicEval.feedback,
        } : null,
        composition: compositionEval ? {
          score: compositionEval.score,
          feedback: compositionEval.feedback,
        } : null,
        rebuttal: rebuttalEval ? {
          score: rebuttalEval.score,
          feedback: rebuttalEval.feedback,
        } : null,
        english: englishEval ? {
          score: englishEval.score,
          feedback: englishEval.feedback,
        } : null,
        general: generalEval ? {
          score: generalEval.score,
          feedback: generalEval.feedback,
        } : null,
      },
    };
  }
} 