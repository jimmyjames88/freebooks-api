'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          min: 2
        }
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      phone: {
        type: Sequelize.STRING,
        validate: {
          phone: true
        }
      },
      website: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,

      // Associations
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Clients');
  }
};