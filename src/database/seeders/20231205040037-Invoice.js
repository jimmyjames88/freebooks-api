'use strict';

const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [...Array(15).keys()].map((i) => ({
      ref: `INV-${i}`,
      date: faker.date.past(),
      notes: faker.lorem.sentence(),
      subtotal: faker.finance.amount(),
      tax: faker.finance.amount(),
      total: faker.finance.amount(),
      userId: 1,
      clientId: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await queryInterface.bulkInsert('invoices', data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
