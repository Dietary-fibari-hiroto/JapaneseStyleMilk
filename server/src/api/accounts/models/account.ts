import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';

// 作成時に必要な属性を定義
export interface AccountAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  img_url: string;
  created_at: Date;
}

// 作成時にオプショナルな属性を定義
export interface AccountCreationAttributes extends Optional<AccountAttributes, 'id' | 'created_at'> {}

export interface CreateAccountDTO {
  name: string;
  email: string;
  password: string;
  img_url: string;
}

class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public img_url!: string;
  public created_at!: Date;
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING(255),
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
    tableName: 'accounts',
    timestamps: false,
  }
);

export default Account; 