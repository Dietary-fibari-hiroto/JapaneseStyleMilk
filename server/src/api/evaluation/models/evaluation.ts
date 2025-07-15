import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';

// 評価結果の属性を定義（既存のテーブル構造に合わせる）
export interface EvaluationAttributes {
  debate_history_id: number;
  score: number;
  feedback: string;
}

export interface EvaluationCreationAttributes extends Optional<EvaluationAttributes, 'score' | 'feedback'> {}

// 評価リクエストのDTO
export interface EvaluationRequestDTO {
  user_id1: number;
  user_id2: number;
  debate_history_id: number;
  debate_topic: string;
  debate_texts: Array<{
    turn_number: number;
    sequence_in_turn: number;
    user_id: number;
    text: string;
  }>;
}

// 評価レスポンスのDTO
export interface EvaluationResponseDTO {
  users: {
    [userId: number]: {
      logic: { score: number; feedback: string };
      composition: { score: number; feedback: string };
      rebuttal: { score: number; feedback: string };
      english: { score: number; feedback: string };
      general: { score: number; feedback: string };
    };
  };
  winner: number | null;
}

// 既存の評価テーブルに対応するモデル
class LogicEvaluation extends Model<EvaluationAttributes, EvaluationCreationAttributes> implements EvaluationAttributes {
  public debate_history_id!: number;
  public score!: number;
  public feedback!: string;
}

LogicEvaluation.init(
  {
    debate_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 25,
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'フィードバックが生成されていません。',
    },
  },
  {
    sequelize,
    tableName: 'logic_es',
    timestamps: false,
  }
);

class CompositionEvaluation extends Model<EvaluationAttributes, EvaluationCreationAttributes> implements EvaluationAttributes {
  public debate_history_id!: number;
  public score!: number;
  public feedback!: string;
}

CompositionEvaluation.init(
  {
    debate_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 25,
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'フィードバックが生成されていません。',
    },
  },
  {
    sequelize,
    tableName: 'composition_es',
    timestamps: false,
  }
);

class RebuttalEvaluation extends Model<EvaluationAttributes, EvaluationCreationAttributes> implements EvaluationAttributes {
  public debate_history_id!: number;
  public score!: number;
  public feedback!: string;
}

RebuttalEvaluation.init(
  {
    debate_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 25,
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'フィードバックが生成されていません。',
    },
  },
  {
    sequelize,
    tableName: 'rebuttal_es',
    timestamps: false,
  }
);

class EnglishEvaluation extends Model<EvaluationAttributes, EvaluationCreationAttributes> implements EvaluationAttributes {
  public debate_history_id!: number;
  public score!: number;
  public feedback!: string;
}

EnglishEvaluation.init(
  {
    debate_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 25,
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'フィードバックが生成されていません。',
    },
  },
  {
    sequelize,
    tableName: 'english_es',
    timestamps: false,
  }
);

class GeneralEvaluation extends Model<EvaluationAttributes, EvaluationCreationAttributes> implements EvaluationAttributes {
  public debate_history_id!: number;
  public score!: number;
  public feedback!: string;
}

GeneralEvaluation.init(
  {
    debate_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 25,
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'フィードバックが生成されていません。',
    },
  },
  {
    sequelize,
    tableName: 'general_es',
    timestamps: false,
  }
);

export { LogicEvaluation, CompositionEvaluation, RebuttalEvaluation, EnglishEvaluation, GeneralEvaluation }; 