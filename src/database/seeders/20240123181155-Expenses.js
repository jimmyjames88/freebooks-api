'use strict';

const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [...Array(300).keys()].map((i) => {
      return {
        UserId: 1,
        InvoiceId: Math.floor(Math.random() * 300) + 1,
        date: faker.date.past(),
        description: faker.lorem.sentence(),
        subtotal: faker.finance.amount()
      }
    })

    await queryInterface.bulkInsert('expenses', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('expenses')
  }
};
