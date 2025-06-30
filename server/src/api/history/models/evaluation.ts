import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';

export interface EvaluationAttributes {
  debate_history_id: number;
  score: number;
  feedback: string;
}

export interface EvaluationCreationAttributes extends Optional<EvaluationAttributes, 'score' | 'feedback'> {}

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