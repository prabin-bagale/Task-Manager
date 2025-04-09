const User = require('./User');
const Task = require('./Task');
const sequelize = require('../config/database');

// Define associations
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Task,
  sequelize
}; 