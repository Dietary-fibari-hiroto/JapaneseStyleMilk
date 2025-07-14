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

      if (!evaluationData.debate_topic || evaluationData.debate_topic.trim() === '') {
        return res.status(400).json({ error: 'ディベートトピックが必要です' });
      }

      if (!evaluationData.debate_texts || evaluationData.debate_texts.length === 0) {
        return res.status(400).json({ error: 'ディベートテキストが必要です' });
      }

      // 評価実行
      const evaluationResult = await this.evaluationService.evaluateDebate(evaluationData);

      res.json({
        success: true,
        evaluation: evaluationResult
      });

    } catch (error) {
      console.error('ディベート評価エラー:', error);
      res.status(500).json({ 
        error: 'ディベートの評価に失敗しました',
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