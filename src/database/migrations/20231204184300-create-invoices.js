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
      issueDate: {
        type: Sequelize.DATEONLY
      },
      dueDate: {
        type: Sequelize.DATEONLY
      },
      notes: {
        type: Sequelize.STRING
      },
      lineItems: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2)
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2)
      },
      total: {
        type: Sequelize.DECIMAL(10, 2)
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