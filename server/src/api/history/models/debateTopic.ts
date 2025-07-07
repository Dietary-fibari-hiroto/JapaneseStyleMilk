import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';

export interface DebateTopicAttributes {
  id: number;
  topic: string;
  enable: boolean;
  created_at: Date;
}

export interface DebateTopicCreationAttributes extends Optional<DebateTopicAttributes, 'id' | 'created_at'> {}

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
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'debate_topics',
    timestamps: false,
  }
);

export default DebateTopic; 