import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';

export interface DebateTextAttributes {
  id: number;
  debate_history_id: number;
  text: string;
  turn_number: number;
  sequence_in_turn: number;
}

export interface DebateTextCreationAttributes extends Optional<DebateTextAttributes, 'id'> {}

class DebateText extends Model<DebateTextAttributes, DebateTextCreationAttributes> implements DebateTextAttributes {
  public id!: number;
  public debate_history_id!: number;
  public text!: string;
  public turn_number!: number;
  public sequence_in_turn!: number;
}

DebateText.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    debate_history_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    turn_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sequence_in_turn: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'debate_texts',
    timestamps: false,
  }
);

export default DebateText; 