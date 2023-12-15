'use strict';

const { query } = require('express');
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    const data = [...Array(5).keys()].map((i) => ({
      name: faker.company.name(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      website: faker.internet.url(),
      address: JSON.stringify({
        line1: faker.location.streetAddress(),
        line2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postal: faker.location.zipCode(),
        country: faker.location.country()
      }),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await queryInterface.bulkInsert('clients', data)
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
