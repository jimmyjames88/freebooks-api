'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcryptjs')

module.exports = {
  async up (queryInterface, Sequelize) {
    // Admin account
    const password = await bcrypt.hash('password', 10)
    await queryInterface.bulkInsert('users', [{
      name: 'Admin',
      email: 'me@james-allen.ca',
      password,
      createdAt: new Date(),
      updatedAt: new Date()
    }])

    await queryInterface.bulkInsert('profiles', [{
      userId: 1,
      displayName: 'James Allen',
      displayEmail: 'billing@james-allen.ca',
      phone: '555-555-5555',
      address: JSON.stringify({
        line1: '123 Fake Street',
        line2: 'B',
        city: 'Vancouver',
        state: 'BC',
        postal: 'V1V 1V1',
        country: 'Canada'
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
