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
  }
};
