'use strict';
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const invoiceNum = Math.floor(Math.random()*90000) + 10000;
    const data = [...Array(300).keys()].map((i) => {
      const subtotal = parseFloat(faker.finance.amount())
      const status = i % 2 === 0 ? 'DRAFT' : 'SENT'
      return {
        refNo: `INV-${invoiceNum + i}`,
        status,
        issueDate: faker.date.past(),
        dueDate: faker.date.anytime(),
        notes: faker.lorem.sentence(),
        subtotal,
        tax: subtotal * 0.05,
        total: subtotal * 1.05,
        userId: 1,
        clientId: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        lineItems: JSON.stringify(
          [ ...Array(Math.floor(Math.random() * 20)) ].map(() => ({
            description: faker.lorem.sentence(),
            quantity: Math.floor(Math.random() * 10) + 1,
            rate: parseFloat(faker.finance.amount()),
          }))
        )
      }
    })

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
