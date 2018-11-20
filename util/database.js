const Sequelize = require('sequelize')

const sequelize = new Sequelize('nodecomplete', 'amazingd', 'davi1234', {
    dialect: 'mysql', host: 'localhost'
})

module.exports = sequelize