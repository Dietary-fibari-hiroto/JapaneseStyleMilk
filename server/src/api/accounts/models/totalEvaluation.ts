import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';

export interface TotalEvaluationAttributes {
  account_id: number;
  total_score: number;
  advice: string;
  winning_streak: number;
  wins: number;
  loses: number;
}

export interface TotalEvaluationCreationAttributes extends Optional<TotalEvaluationAttributes, 'total_score' | 'advice' | 'winning_streak' | 'wins' | 'loses'> {}

class TotalEvaluation extends Model<TotalEvaluationAttributes, TotalEvaluationCreationAttributes> implements TotalEvaluationAttributes {
  public account_id!: number;
  public total_score!: number;
  public advice!: string;
  public winning_streak!: number;
  public wins!: number;
  public loses!: number;
}

TotalEvaluation.init(
  {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    total_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    advice: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'ディベートを開始しよう！',
    },
    winning_streak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    wins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    loses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'total_es',
    timestamps: false,
  }
);

export default TotalEvaluation; 