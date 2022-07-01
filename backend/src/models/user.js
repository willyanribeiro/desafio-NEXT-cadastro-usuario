const { Sequelize } = require("sequelize"); // estava assim: = require("sequelize/types");
const sequelize = require('../database/index');

const User = sequelize.define('User', {
    //Passamos os objetos com o esquema de cada um.
    //Aqui fazemos o mapeamento das colunas que existirão no BD para com as 
    //propriedades que haverão no projeto local.
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
  } 
  );
  

  module.exports = User;