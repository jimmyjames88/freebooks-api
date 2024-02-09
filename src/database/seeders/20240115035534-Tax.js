'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('taxes', [
      {
        UserId: 1,
        name: 'GST',
        rate: 0.05,
        type: 'PERCENTAGE',
        default: true
      },
      {
        UserId: 1,
        name: 'DBAA',
        rate: 200.00,
        type: 'FLAT',
        default: false
      }
    ])
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
