import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../config/database';
import Account from './account';

// 作成時に必要な属性を定義
export interface AccountStateAttributes {
  account_id: number;
  rank_id: number;
  goods: number;
  reports: number;
  state: number;
}

// 作成時にオプショナルな属性を定義
export interface AccountStateCreationAttributes extends Optional<AccountStateAttributes, 'goods' | 'reports' | 'state'> {}

class AccountState extends Model<AccountStateAttributes, AccountStateCreationAttributes> implements AccountStateAttributes {
  public account_id!: number;
  public rank_id!: number;
  public goods!: number;
  public reports!: number;
  public state!: number;
}

AccountState.init(
  {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Account,
        key: 'id',
      },
    },
    rank_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goods: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reports: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'account_states',
    timestamps: false,
  }
);

// アソシエーションの設定
Account.hasOne(AccountState, { foreignKey: 'account_id' });
AccountState.belongsTo(Account, { foreignKey: 'account_id' });

export default AccountState; 