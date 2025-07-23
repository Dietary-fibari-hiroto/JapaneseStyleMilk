import { Request, Response } from 'express';
import { HistoryService, CreateDebateHistoryDTO } from '../services/historyService';

export class HistoryController {
  constructor(private historyService: HistoryService) {}

  async getUserDebateHistories(req: Request, res: Response) {
    try {
      // 認証ミドルウェアで設定したユーザーID
      const accountId = req.user!.id;
      const histories = await this.historyService.getUserDebateHistories(accountId);
      // 必要な情報だけ整形して返す
      const result = histories.map((h: any) => ({
        debate_history_id: h.id,
        topic: h.debate_room?.debate_topic?.topic || '',
        created_at: h.created_at,
        role: h.role,
        win_flag: h.win_flag,
      }));
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '履歴の取得に失敗しました' });
    }
  }

  async createDebateHistory(req: Request, res: Response) {
    try {
      const accountId = req.user!.id;
      const { debate_room_id, role, win_flag } = req.body;

      // バリデーション
      if (!debate_room_id || role === undefined || win_flag === undefined) {
        return res.status(400).json({ error: 'debate_room_id, role, win_flagが必要です' });
      }

      const historyData: CreateDebateHistoryDTO = {
        debate_room_id,
        account_id: accountId,
        role,
        win_flag,
      };

      const newHistory = await this.historyService.createDebateHistory(historyData);

      res.status(201).json({
        id: newHistory.id,
        debate_room_id: newHistory.debate_room_id,
        account_id: newHistory.account_id,
        role: newHistory.role,
        win_flag: newHistory.win_flag,
        created_at: newHistory.created_at,
      });
    } catch (error) {
      console.error('履歴作成エラー:', error);
      res.status(500).json({ error: '履歴の作成に失敗しました' });
    }
  }

  async createEvaluations(req: Request, res: Response) {
    try {
      const debateHistoryId = Number(req.params.debate_history_id);
      const evaluationData = req.body;

      if (!debateHistoryId) {
        return res.status(400).json({ error: 'ディベート履歴IDが必要です' });
      }

      // 評価データのバリデーション
      if (!evaluationData.logic || !evaluationData.composition || !evaluationData.rebuttal || !evaluationData.english || !evaluationData.general) {
        return res.status(400).json({ error: '評価データが不完全です' });
      }

      // 評価結果をDBに保存
      const savedEvaluations = await this.historyService.createEvaluations(debateHistoryId, evaluationData);

      res.status(201).json({
        message: '評価が完了しました',
        debate_history_id: debateHistoryId,
        evaluations: {
          logic: {
            score: savedEvaluations.logic.score,
            feedback: savedEvaluations.logic.feedback,
          },
          composition: {
            score: savedEvaluations.composition.score,
            feedback: savedEvaluations.composition.feedback,
          },
          rebuttal: {
            score: savedEvaluations.rebuttal.score,
            feedback: savedEvaluations.rebuttal.feedback,
          },
          english: {
            score: savedEvaluations.english.score,
            feedback: savedEvaluations.english.feedback,
          },
          general: {
            score: savedEvaluations.general.score,
            feedback: savedEvaluations.general.feedback,
          },
        },
      });
    } catch (error) {
      console.error('評価作成エラー:', error);
      res.status(500).json({ error: '評価の作成に失敗しました' });
    }
  }

  async getDebateDetail(req: Request, res: Response) {
    try {
      const debateHistoryId = Number(req.params.id);
      const accountId = req.user!.id;

      if (!debateHistoryId) {
        return res.status(400).json({ error: 'ディベート履歴IDが必要です' });
      }

      const debateDetail = await this.historyService.getDebateDetail(debateHistoryId, accountId);

      if (!debateDetail) {
        return res.status(404).json({ error: 'ディベート履歴が見つかりません' });
      }

      res.json(debateDetail);
    } catch (error) {
      console.error('ディベート詳細取得エラー:', error);
      res.status(500).json({ error: 'ディベート詳細の取得に失敗しました' });
    }
  }

  async getEvaluations(req: Request, res: Response) {
    try {
      const debateHistoryId = Number(req.params.debate_history_id);
      const accountId = req.user!.id;

      if (!debateHistoryId) {
        return res.status(400).json({ error: 'ディベート履歴IDが必要です' });
      }

      const evaluations = await this.historyService.getEvaluations(debateHistoryId, accountId);

      if (!evaluations) {
        return res.status(404).json({ error: 'ディベート履歴または評価が見つかりません' });
      }

      res.json(evaluations);
    } catch (error) {
      console.error('評価取得エラー:', error);
      res.status(500).json({ error: '評価の取得に失敗しました' });
    }
  }
 
  async getWinLossStats(req: Request, res: Response) {
    try {
      const accountId = req.user!.id;
      const stats = await this.historyService.getWinLossStats(accountId);
      res.json(stats);
    } catch (error) {
      console.error('勝敗統計取得エラー:', error);
      res.status(500).json({ error: '勝敗統計の取得に失敗しました' });
    }
  }
} 