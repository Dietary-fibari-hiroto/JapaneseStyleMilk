import { Request, Response } from 'express';
import { TopicService } from '../services/topicService';
import { CreateDebateTopicDTO } from '../models/debateTopic';

export class TopicController {
  constructor(private topicService: TopicService) { }

  // ランダムにトピックを1件とってくる
  async getRandomTopic(req: Request, res: Response) {
    try {
      const topic = await this.topicService.getRandomTopic();
      
      if (!topic) {
        return res.status(404).json({ error: '利用可能なトピックが見つかりません' });
      }

      res.json({
        id: topic.id,
        topic: topic.topic,
        enable: topic.enable,
        created_at: topic.created_at
      });
    } catch (error) {
      console.error('ランダムトピック取得エラー:', error);
      res.status(500).json({ error: 'トピックの取得に失敗しました' });
    }
  }

  // 全ての有効なトピックを取得する
  async getAllTopics(req: Request, res: Response) {
    try {
      const topics = await this.topicService.getAllEnabledTopics();
      
      res.json(topics.map(topic => ({
        id: topic.id,
        topic: topic.topic,
        enable: topic.enable,
        created_at: topic.created_at
      })));
    } catch (error) {
      console.error('全トピック取得エラー:', error);
      res.status(500).json({ error: 'トピックの取得に失敗しました' });
    }
  }
}