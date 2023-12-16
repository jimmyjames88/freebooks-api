'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      refNo: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'DRAFT'
      },
      date: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      lineItems: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      subtotal: {
        type: Sequelize.DECIMAL
      },
      tax: {
        type: Sequelize.DECIMAL
      },
      total: {
        type: Sequelize.DECIMAL
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,

      // Associations
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false,
      },
      clientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id'
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invoices');
  }
};