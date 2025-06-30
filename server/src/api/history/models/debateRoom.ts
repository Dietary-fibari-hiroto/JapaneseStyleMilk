import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';
import DebateTopic from './debateTopic';

export interface DebateRoomAttributes {
  id: number;
  debete_topic_id: number;
  allow_observation: boolean;
  created_at: Date;
}

export interface DebateRoomCreationAttributes extends Optional<DebateRoomAttributes, 'id' | 'created_at'> {}

class DebateRoom extends Model<DebateRoomAttributes, DebateRoomCreationAttributes> implements DebateRoomAttributes {
  public id!: number;
  public debete_topic_id!: number;
  public allow_observation!: boolean;
  public created_at!: Date;
}

DebateRoom.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    debete_topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    allow_observation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'debate_rooms',
    timestamps: false,
  }
);

DebateRoom.belongsTo(DebateTopic, { foreignKey: 'debete_topic_id', as: 'debate_topic' });

export default DebateRoom; 