'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoicesTaxes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InvoicesTaxes.init({
    InvoiceId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Invoices',
        key: 'id'
      }
    },
    TaxId: { 
      type: DataTypes.INTEGER,
      references: {
        model: 'Taxes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'InvoicesTaxes',
    tableName: 'invoices_taxes'
  });
  return InvoicesTaxes;
};