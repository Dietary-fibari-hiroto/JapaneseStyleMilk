import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';

// 作成時に必要な属性を定義
export interface DebateTopicAttributes {
  id: number;
  topic: string;
  enable: boolean;
  created_at: Date;
}

// 作成時にオプショナルな属性を定義
export interface DebateTopicCreationAttributes extends Optional<DebateTopicAttributes, 'id' | 'created_at'> {}

export interface CreateDebateTopicDTO {
  topic: string;
  enable?: boolean;
}

class DebateTopic extends Model<DebateTopicAttributes, DebateTopicCreationAttributes> implements DebateTopicAttributes {
  public id!: number;
  public topic!: string;
  public enable!: boolean;
  public created_at!: Date;
}

DebateTopic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    topic: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    enable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'debate_topics',
    timestamps: false,
  }
);

export default DebateTopic; 