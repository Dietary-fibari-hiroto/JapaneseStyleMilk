import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';
import DebateRoom from './debateRoom';

export interface DebateHistoryAttributes {
  id: number;
  debate_room_id: number;
  account_id: number;
  role: number;
  win_flag: number;
  created_at: Date;
}

export interface DebateHistoryCreationAttributes extends Optional<DebateHistoryAttributes, 'id' | 'created_at'> {}

class DebateHistory extends Model<DebateHistoryAttributes, DebateHistoryCreationAttributes> implements DebateHistoryAttributes {
  public id!: number;
  public debate_room_id!: number;
  public account_id!: number;
  public role!: number;
  public win_flag!: number;
  public created_at!: Date;
}

DebateHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    debate_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    win_flag: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'debate_histories',
    timestamps: false,
  }
);

DebateHistory.belongsTo(DebateRoom, { foreignKey: 'debate_room_id', as: 'debate_room' });

export default DebateHistory; 