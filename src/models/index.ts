import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require('@config/config.json')[env];

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);

export { Sequelize, sequelize }
export * from './Client'
export * from './Expense'
export * from './ExpensesTaxes'
export * from './Invoice'
export * from './InvoicesTaxes'
export * from './Payment'
export * from './PaymentType'
export * from './Profile'
export * from './Tax'
export * from './User'
