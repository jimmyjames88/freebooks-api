'use strict';

const { query } = require('express');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('paymentTypes', [
      { name: 'Cash', icon: 'mdi-cash' },
      { name: 'Credit Card', icon: 'mdi-credit-card-outline' },
      { name: 'Debit Card', icon: 'mdi-credit-card' },
      { name: 'Check', icon: 'mdi-check' },
      { name: 'Paypal', icon: 'mdi-cart-outline' },
      { name: 'Other', icon: '' }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('paymentTypes', null, {})
  }
};
