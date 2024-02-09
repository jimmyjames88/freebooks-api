'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const expenses = await queryInterface.select(null, 'expenses', { attributes: ['id'] } )
    const data = [...Array(expenses.length).keys()].map((i) => {
      return {
        ExpenseId: expenses[i].id,
        TaxId: 1, // GST
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await queryInterface.bulkInsert('expenses_taxes', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('expenses_taxes')
  }
};
