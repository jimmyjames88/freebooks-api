'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const invoices = await queryInterface.select(null, 'invoices', { attributes: ['id'] } )
    const data = [...Array(invoices.length).keys()].map((i) => {
      return {
        InvoiceId: invoices[i].id,
        TaxId: 1, // GST
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await queryInterface.bulkInsert('invoices_taxes', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('invoices_taxes')
  }
};
