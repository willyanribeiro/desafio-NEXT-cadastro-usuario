const { Sequelize } = require('sequelize');

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
    dialect: 'sqlite', //qual o BD que vou usar para que o Sequelize traduza os comandos JS para SQL.
    storage: 'database.sqlite'
  });
  
  module.exports = sequelize;