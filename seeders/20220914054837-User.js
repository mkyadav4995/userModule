'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   
     await queryInterface.bulkInsert('users', [{
      uuid : "123e4567-e89b-12d3-a456-426614174000",
      name : "manish",
      email : "mk737010@gmail.com",
      password : "$2b$05$EJD3m6JSLuSBkjlMOCQcm.2Sz4A4Pr0SIZvpLX/EFeUs5V3GqIKrm",  //123456789,
      role : "superAdmin",
      phone_number: '123456789',
      status : 1,
      created_at: new Date,
      updated_at: new Date
     }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('users', null, {});
  }
};
