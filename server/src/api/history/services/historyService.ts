import DebateHistory from '../models/debateHistory';
import DebateRoom from '../models/debateRoom';
import DebateTopic from '../models/debateTopic';
import DebateText from '../models/debateText';
import TotalEvaluation from '../../accounts/models/totalEvaluation';
import { LogicEvaluation, CompositionEvaluation, RebuttalEvaluation, EnglishEvaluation, GeneralEvaluation } from '../models/evaluation';

export interface CreateDebateHistoryDTO {
  debate_room_id: number;
  account_id: number;
  role?: number;
  win_flag?: number;
}

export interface EvaluationResult {
  logic: { score: number; feedback: string };
  composition: { score: number; feedback: string };
  rebuttal: { score: number; feedback: string };
  english: { score: number; feedback: string };
  general: { score: number; feedback: string };
}

export class HistoryService {
  async getUserDebateHistories(accountId: number) {
    // debate_histories, debate_rooms, debate_topicsをJOIN
    return DebateHistory.findAll({
      where: { account_id: accountId },
      include: [
        {
          model: DebateRoom,
          as: 'debate_room',
          include: [
            {
              model: DebateTopic,
              as: 'debate_topic',
              attributes: ['topic'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async createDebateHistory(historyData: CreateDebateHistoryDTO) {
    // トランザクションで履歴作成と評価作成を一括実行
    const result = await DebateHistory.sequelize!.transaction(async (t) => {
      // デフォルト値を設定
      const finalHistoryData = {
        ...historyData,
        role: historyData.role || 1,
        win_flag: historyData.win_flag || 0,
      };

      // ディベート履歴を作成
      const newHistory = await DebateHistory.create(finalHistoryData, { transaction: t });

      // 適当な評価データを生成
      const evaluationData: EvaluationResult = {
        logic: {
          score: Math.floor(Math.random() * 26),
          feedback: '論理的思考が適切にできています。さらに深い分析を心がけましょう。'
        },
        composition: {
          score: Math.floor(Math.random() * 26),
          feedback: '構成が論理的に整理されています。より明確な流れを作りましょう。'
        },
        rebuttal: {
          score: Math.floor(Math.random() * 26),
          feedback: '反論が効果的にできています。相手の主張をより詳しく分析しましょう。'
        },
        english: {
          score: Math.floor(Math.random() * 26),
          feedback: '英語表現が適切です。より自然な表現を心がけましょう。'
        },
        general: {
          score: Math.floor(Math.random() * 26),
          feedback: '全体的に良いディベートでした。継続して練習を重ねましょう。'
        }
      };

      // 評価結果をDBに保存
      await LogicEvaluation.create(
        {
          debate_history_id: newHistory.id,
          score: evaluationData.logic.score,
          feedback: evaluationData.logic.feedback,
        },
        { transaction: t }
      );

      await CompositionEvaluation.create(
        {
          debate_history_id: newHistory.id,
          score: evaluationData.composition.score,
          feedback: evaluationData.composition.feedback,
        },
        { transaction: t }
      );

      await RebuttalEvaluation.create(
        {
          debate_history_id: newHistory.id,
          score: evaluationData.rebuttal.score,
          feedback: evaluationData.rebuttal.feedback,
        },
        { transaction: t }
      );

      await EnglishEvaluation.create(
        {
          debate_history_id: newHistory.id,
          score: evaluationData.english.score,
          feedback: evaluationData.english.feedback,
        },
        { transaction: t }
      );

      await GeneralEvaluation.create(
        {
          debate_history_id: newHistory.id,
          score: evaluationData.general.score,
          feedback: evaluationData.general.feedback,
        },
        { transaction: t }
      );

      return newHistory;
    });

    return result;
  }

  async getDebateTexts(debateHistoryId: number) {
    return DebateText.findAll({
      where: { debate_history_id: debateHistoryId },
      order: [['turn_number', 'ASC'], ['sequence_in_turn', 'ASC']],
    });
  }

  async createEvaluations(debateHistoryId: number, evaluationData: EvaluationResult) {
    // トランザクションで一括保存
    const result = await DebateHistory.sequelize!.transaction(async (t) => {
      const logicEval = await LogicEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationData.logic.score,
          feedback: evaluationData.logic.feedback,
        },
        { transaction: t }
      );

      const compositionEval = await CompositionEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationData.composition.score,
          feedback: evaluationData.composition.feedback,
        },
        { transaction: t }
      );

      const rebuttalEval = await RebuttalEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationData.rebuttal.score,
          feedback: evaluationData.rebuttal.feedback,
        },
        { transaction: t }
      );

      const englishEval = await EnglishEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationData.english.score,
          feedback: evaluationData.english.feedback,
        },
        { transaction: t }
      );

      const generalEval = await GeneralEvaluation.create(
        {
          debate_history_id: debateHistoryId,
          score: evaluationData.general.score,
          feedback: evaluationData.general.feedback,
        },
        { transaction: t }
      );

      return {
        logic: logicEval,
        composition: compositionEval,
        rebuttal: rebuttalEval,
        english: englishEval,
        general: generalEval,
      };
    });

    return result;
  }

  async getDebateDetail(debateHistoryId: number, accountId: number) {
    // ディベート履歴の基本情報を取得
    const debateHistory = await DebateHistory.findOne({
      where: { 
        id: debateHistoryId,
        account_id: accountId // 自分の履歴のみ取得
      },
      include: [
        {
          model: DebateRoom,
          as: 'debate_room',
          include: [
            {
              model: DebateTopic,
              as: 'debate_topic',
              attributes: ['topic'],
            },
          ],
        },
      ],
    });

    if (!debateHistory) {
      return null;
    }

    const debateHistoryData = debateHistory as any;

    // ディベートテキストを取得
    const debateTexts = await this.getDebateTexts(debateHistoryId);

    return {
      debate_info: {
        id: debateHistoryData.id,
        topic: debateHistoryData.debate_room?.debate_topic?.topic || '',
        created_at: debateHistoryData.created_at,
        role: debateHistoryData.role,
        win_flag: debateHistoryData.win_flag,
      },
      debate_texts: debateTexts.map(text => ({
        turn_number: text.turn_number,
        sequence_in_turn: text.sequence_in_turn,
        text: text.text,
      })),
    };
  }

  async getEvaluations(debateHistoryId: number, accountId: number) {
    // まず、該当のディベート履歴が自分のものかチェック
    const debateHistory = await DebateHistory.findOne({
      where: { 
        id: debateHistoryId,
        account_id: accountId
      }
    });

    if (!debateHistory) {
      return null;
    }

    // 評価結果を取得
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
  async getWinLossStats(accountId: number) {
    // accountIdを元にwins,losesを返す
    const total_es = await TotalEvaluation.findOne({
      where: { account_id: accountId }
    });
    return total_es ? {
      wins: total_es.wins,
      loses: total_es.loses,
    } : null;
  }

} 