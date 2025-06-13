import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';

export interface RankAttributes {
  id: number;
  name: string;
  level: number;
  created_at: Date;
}

export interface RankCreationAttributes extends Optional<RankAttributes, 'id' | 'created_at'> {}

class Rank extends Model<RankAttributes, RankCreationAttributes> implements RankAttributes {
  public id!: number;
  public name!: string;
  public level!: number;
  public created_at!: Date;
}

Rank.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'ranks',
    timestamps: false,
  }
);

export default Rank; 