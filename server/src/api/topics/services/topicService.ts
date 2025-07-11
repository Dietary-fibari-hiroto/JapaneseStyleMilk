import { Op } from 'sequelize';
import sequelize from '../../../config/database';
import DebateTopic from '../models/debateTopic';
import { CreateDebateTopicDTO } from '../models/debateTopic';

export class TopicService {
  // 有効なトピックをランダムに1件取得する
  async getRandomTopic() {
    return DebateTopic.findOne({
      where: {
        enable: true
      },
      order: sequelize.random()
    });
  }

  // 全ての有効なトピックを取得する
  async getAllEnabledTopics() {
    return DebateTopic.findAll({
      where: {
        enable: true
      },
      order: [['created_at', 'DESC']]
    });
  }
} 