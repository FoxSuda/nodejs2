const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true},
    loginType: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
})

const UserToken = sequelize.define('user_token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING, allowNull: false },
});

User.hasMany(UserToken);
UserToken.belongsTo(User);

module.exports = {
    User,
    UserToken
}