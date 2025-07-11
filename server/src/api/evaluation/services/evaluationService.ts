import { GeminiClient } from '../../gemini/geminiApi';
import { LogicEvaluation, CompositionEvaluation, RebuttalEvaluation, EnglishEvaluation, GeneralEvaluation } from '../models/evaluation';
import { EvaluationRequestDTO, EvaluationResponseDTO } from '../models/evaluation';
import DebateHistory from '../../history/models/debateHistory';
import TotalEvaluation from '../../accounts/models/totalEvaluation';

export class EvaluationService {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient(process.env.GEMINI_SECRET_KEY || '');
  }

  // ディベート内容を評価する
  async evaluateDebate(evaluationData: EvaluationRequestDTO): Promise<EvaluationResponseDTO> {
    try {
      // Gemini APIに送信するプロンプトを作成
      const prompt = this.createEvaluationPrompt(evaluationData);
      
      // Gemini APIから評価結果を取得
      const aiResponse = await this.geminiClient.ask(prompt);
      
      // AIの応答をパースして評価結果を取得
      const evaluationResult = this.parseAIResponse(aiResponse);
      
      // ディベート履歴の存在確認
      const debateHistory = await DebateHistory.findByPk(evaluationData.debate_history_id);
      if (!debateHistory) {
        throw new Error(`ディベート履歴が見つかりません: ${evaluationData.debate_history_id}`);
      }

      // 評価結果をデータベースに保存
      await this.saveEvaluation(evaluationData.debate_history_id, evaluationResult);
      
      // 勝敗決定と統計更新
      await this.updateWinLossStats(evaluationData, evaluationResult);
      
      return evaluationResult;
    } catch (error) {
      console.error('ディベート評価エラー:', error);
      throw new Error('ディベートの評価に失敗しました');
    }
  }

  // 評価用のプロンプトを作成
  private createEvaluationPrompt(evaluationData: EvaluationRequestDTO): string {
    const { debate_topic, debate_texts, user_id1, user_id2 } = evaluationData;
    
    // ディベートテキストを時系列で整理
    const sortedTexts = debate_texts.sort((a, b) => {
      if (a.turn_number !== b.turn_number) {
        return a.turn_number - b.turn_number;
      }
      return a.sequence_in_turn - b.sequence_in_turn;
    });

    // ディベート内容を文字列として構築
    const debateContent = sortedTexts.map(text => 
      `ターン${text.turn_number}-${text.sequence_in_turn} (ユーザー${text.user_id}): ${text.text}`
    ).join('\n');

    return `
以下のディベート内容を評価してください。各ユーザーに対して個別に評価を行い、各項目を25点満点で採点してください。

【ディベート情報】
トピック: ${debate_topic}
ユーザー1: ${user_id1}
ユーザー2: ${user_id2}

【ディベート内容】
${debateContent}

【評価項目】
各ユーザーに対して以下を評価してください：
1. 英語力 (English Score): 0-25点
2. 構成力 (Composition Score): 0-25点  
3. 反論力 (Rebuttal Score): 0-25点
4. 論理性 (Logic Score): 0-25点
5. 総合力の感想 (General Feedback): 3行程度

以下のJSON形式で回答してください：
{
  "users": {
    "${user_id1}": {
      "logic_score": 数値,
      "composition_score": 数値,
      "rebuttal_score": 数値,
      "english_score": 数値,
      "general_feedback": "3行程度の感想"
    },
    "${user_id2}": {
      "logic_score": 数値,
      "composition_score": 数値,
      "rebuttal_score": 数値,
      "english_score": 数値,
      "general_feedback": "3行程度の感想"
    }
  },
  "winner": "勝者のid"
}

注意：
- 各スコアは0-25の整数で回答してください
- general_feedbackは3行程度の日本語で感想を述べてください
- 各ユーザーを公平に評価してください
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
      if (!evaluationData.users || !evaluationData.winner) {
        throw new Error('usersまたはwinnerフィールドが不足しています');
      }

      const users = evaluationData.users;
      const result: EvaluationResponseDTO = {
        users: {},
        winner: evaluationData.winner
      };

      // 各ユーザーの評価を処理
      for (const [userId, userData] of Object.entries(users)) {
        const userEval = userData as any;
        
        // 必須フィールドの検証
        const requiredFields = ['logic_score', 'composition_score', 'rebuttal_score', 'english_score', 'general_feedback'];
        for (const field of requiredFields) {
          if (!(field in userEval)) {
            throw new Error(`ユーザー${userId}の必須フィールド ${field} が不足しています`);
          }
        }

        // スコアの範囲チェック
        const scores = ['logic_score', 'composition_score', 'rebuttal_score', 'english_score'];
        for (const score of scores) {
          const value = userEval[score];
          if (typeof value !== 'number' || value < 0 || value > 25) {
            throw new Error(`ユーザー${userId}の${score}の値が無効です: ${value}`);
          }
        }

        result.users[Number(userId)] = {
          logic: {
            score: userEval.logic_score,
            feedback: `論理性の評価: ${userEval.logic_score}/25点`
          },
          composition: {
            score: userEval.composition_score,
            feedback: `構成力の評価: ${userEval.composition_score}/25点`
          },
          rebuttal: {
            score: userEval.rebuttal_score,
            feedback: `反論力の評価: ${userEval.rebuttal_score}/25点`
          },
          english: {
            score: userEval.english_score,
            feedback: `英語力の評価: ${userEval.english_score}/25点`
          },
          general: {
            score: Math.floor((userEval.logic_score + userEval.composition_score + userEval.rebuttal_score + userEval.english_score) / 4),
            feedback: userEval.general_feedback
          }
        };
      }

      return result;
    } catch (error) {
      console.error('AI応答のパースエラー:', error);
      // フォールバック: デフォルト評価を返す
      return {
        users: {
          1: {
            logic: { score: 15, feedback: '論理性の評価: 15/25点' },
            composition: { score: 15, feedback: '構成力の評価: 15/25点' },
            rebuttal: { score: 15, feedback: '反論力の評価: 15/25点' },
            english: { score: 15, feedback: '英語力の評価: 15/25点' },
            general: { score: 15, feedback: '評価の処理中にエラーが発生しました。' }
          },
          2: {
            logic: { score: 15, feedback: '論理性の評価: 15/25点' },
            composition: { score: 15, feedback: '構成力の評価: 15/25点' },
            rebuttal: { score: 15, feedback: '反論力の評価: 15/25点' },
            english: { score: 15, feedback: '英語力の評価: 15/25点' },
            general: { score: 15, feedback: '評価の処理中にエラーが発生しました。' }
          }
        },
        winner: null
      };
    }
  }

  // 評価結果をデータベースに保存
  private async saveEvaluation(debateHistoryId: number, evaluationResult: EvaluationResponseDTO): Promise<void> {
    // トランザクションで一括保存
    await LogicEvaluation.sequelize!.transaction(async (t) => {
      // 各ユーザーの評価を保存
      for (const [userId, userEvaluation] of Object.entries(evaluationResult.users)) {
        const userEval = userEvaluation as any;
        
        // LogicEvaluation - upsert（存在すれば更新、なければ作成）
        await LogicEvaluation.upsert(
          {
            debate_history_id: debateHistoryId,
            score: userEval.logic.score,
            feedback: userEval.logic.feedback,
          },
          { transaction: t }
        );

        // CompositionEvaluation - upsert
        await CompositionEvaluation.upsert(
          {
            debate_history_id: debateHistoryId,
            score: userEval.composition.score,
            feedback: userEval.composition.feedback,
          },
          { transaction: t }
        );

        // RebuttalEvaluation - upsert
        await RebuttalEvaluation.upsert(
          {
            debate_history_id: debateHistoryId,
            score: userEval.rebuttal.score,
            feedback: userEval.rebuttal.feedback,
          },
          { transaction: t }
        );

        // EnglishEvaluation - upsert
        await EnglishEvaluation.upsert(
          {
            debate_history_id: debateHistoryId,
            score: userEval.english.score,
            feedback: userEval.english.feedback,
          },
          { transaction: t }
        );

        // GeneralEvaluation - upsert
        await GeneralEvaluation.upsert(
          {
            debate_history_id: debateHistoryId,
            score: userEval.general.score,
            feedback: userEval.general.feedback,
          },
          { transaction: t }
        );
      }
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

  // 勝敗決定と統計更新
  private async updateWinLossStats(evaluationData: EvaluationRequestDTO, evaluationResult: EvaluationResponseDTO): Promise<void> {
    const { user_id1, user_id2, debate_history_id } = evaluationData;
    const winnerId = evaluationResult.winner;

    if (!winnerId) {
      console.warn('勝者が決定されていません');
      return;
    }

    // トランザクションで勝敗更新と統計更新を一括実行
    await DebateHistory.sequelize!.transaction(async (t) => {
      // まず、debate_history_idからdebate_room_idを取得
      const debateHistory = await DebateHistory.findByPk(debate_history_id, { transaction: t });
      if (!debateHistory) {
        console.warn(`ディベート履歴が見つかりません: ${debate_history_id}`);
        return;
      }

      const debateRoomId = debateHistory.debate_room_id;

      // 1. debate_historiesテーブルのwin_flagを更新
      const winnerHistory = await DebateHistory.findOne({
        where: { 
          debate_room_id: debateRoomId,
          account_id: winnerId 
        },
        transaction: t
      });

      const loserHistory = await DebateHistory.findOne({
        where: { 
          debate_room_id: debateRoomId,
          account_id: winnerId === user_id1 ? user_id2 : user_id1 
        },
        transaction: t
      });

      if (winnerHistory) {
        await winnerHistory.update({ win_flag: 1 }, { transaction: t });
      }

      if (loserHistory) {
        await loserHistory.update({ win_flag: 0 }, { transaction: t });
      }

      // 2. total_esテーブルの統計を更新
      const winnerStats = await TotalEvaluation.findOne({
        where: { account_id: winnerId },
        transaction: t
      });

      const loserStats = await TotalEvaluation.findOne({
        where: { account_id: winnerId === user_id1 ? user_id2 : user_id1 },
        transaction: t
      });

      // 勝者の統計更新
      const winnerEvaluation = evaluationResult.users[winnerId];
      await TotalEvaluation.upsert({
        account_id: winnerId,
        wins: (winnerStats?.wins || 0) + 1,
        winning_streak: (winnerStats?.winning_streak || 0) + 1,
        total_score: (winnerStats?.total_score || 0) + winnerEvaluation.general.score,
        advice: winnerStats ? winnerStats.advice : '初勝利おめでとうございます！'
      }, { transaction: t });

      // 敗者の統計更新
      const loserId = winnerId === user_id1 ? user_id2 : user_id1;
      const loserEvaluation = evaluationResult.users[loserId];
      await TotalEvaluation.upsert({
        account_id: loserId,
        wins: loserStats?.wins || 0,
        loses: (loserStats?.loses || 0) + 1,
        winning_streak: 0, // 連勝記録をリセット
        total_score: (loserStats?.total_score || 0) + loserEvaluation.general.score,
        advice: loserStats ? loserStats.advice : '次回は勝利を目指しましょう！'
      }, { transaction: t });
    });
  }
} 