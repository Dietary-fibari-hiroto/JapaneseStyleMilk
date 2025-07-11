import { Request, Response } from 'express';
import { EvaluationService } from '../services/evaluationService';
import { EvaluationRequestDTO } from '../models/evaluation';

export class EvaluationController {
  constructor(private evaluationService: EvaluationService) { }

  /**
   * ディベート内容を評価する
   */
  async evaluateDebate(req: Request, res: Response) {
    try {
      const evaluationData: EvaluationRequestDTO = req.body;

      // バリデーション
      if (!evaluationData.debate_history_id) {
        return res.status(400).json({ error: 'ディベート履歴IDが必要です' });
      }

      if (!evaluationData.user_id1 || !evaluationData.user_id2) {
        return res.status(400).json({ error: 'ユーザーIDが必要です' });
      }

      if (!evaluationData.debate_topic || evaluationData.debate_topic.trim() === '') {
        return res.status(400).json({ error: 'ディベートトピックが必要です' });
      }

      if (!evaluationData.debate_texts || evaluationData.debate_texts.length === 0) {
        return res.status(400).json({ error: 'ディベートテキストが必要です' });
      }

      if (!evaluationData.user_id1 || !evaluationData.user_id2) {
        return res.status(400).json({ error: 'ユーザーID1とユーザーID2が必要です' });
      }

      // 各発言にuser_idが含まれているかチェック
      for (const text of evaluationData.debate_texts) {
        if (!text.user_id) {
          return res.status(400).json({ error: '各発言にuser_idが必要です' });
        }
        // user_idがuser_id1またはuser_id2のいずれかであることをチェック
        if (text.user_id !== evaluationData.user_id1 && text.user_id !== evaluationData.user_id2) {
          return res.status(400).json({ error: '発言のuser_idはuser_id1またはuser_id2のいずれかである必要があります' });
        }
      }

      // 評価実行
      const evaluationResult = await this.evaluationService.evaluateDebate(evaluationData);

      res.json({
        success: true,
        evaluation: evaluationResult
      });

    } catch (error) {
      console.error('ディベート評価エラー:', error);
      
      // エラーメッセージを返す
      let errorMessage = 'ディベートの評価に失敗しました';
      if (error instanceof Error) {
        if (error.message.includes('ディベート履歴が見つかりません')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      res.status(500).json({ 
        error: errorMessage,
        details: error instanceof Error ? error.message : '不明なエラー'
      });
    }
  }

  /**
   * ディベート履歴IDから評価結果を取得する
   */
  async getEvaluationByDebateHistoryId(req: Request, res: Response) {
    try {
      const debateHistoryId = Number(req.params.debateHistoryId);

      if (!debateHistoryId) {
        return res.status(400).json({ error: 'ディベート履歴IDが必要です' });
      }

      const evaluation = await this.evaluationService.getEvaluationByDebateHistoryId(debateHistoryId);

      if (!evaluation) {
        return res.status(404).json({ error: '評価結果が見つかりません' });
      }

      res.json({
        success: true,
        evaluation: evaluation
      });

    } catch (error) {
      console.error('評価結果取得エラー:', error);
      res.status(500).json({ error: '評価結果の取得に失敗しました' });
    }
  }
} 