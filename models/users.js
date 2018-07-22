var sequelize = require('sequelize');
var db = new sequelize(process.env.DATABASE_URL);
var User = db.define('users',{
    username:sequelize.STRING,
    email:sequelize.STRING,
    password:sequelize.STRING,
    fullname:sequelize.STRING,
    status:sequelize.STRING,
    token:sequelize.STRING
});
User.sync();


module.exports = User;
