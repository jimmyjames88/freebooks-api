'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
      },
      InvoiceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Invoices',
          key: 'id'
        }
      },
      PaymentTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'paymentTypes',
          key: 'id'
        }
      },
      date: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.STRING
      },
      subtotal: {
        type: Sequelize.DECIMAL(8, 2)
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses');
  }
};