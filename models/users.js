var sequelize = require('sequelize');
var db = new sequelize('postgres://opzjaoiiybegju:bd03e65d91499130246208b888f0dfa88039df276dd6624c52e7a0893c9afacd@ec2-79-125-127-60.eu-west-1.compute.amazonaws.com:5432/depfmisrv0mifk');
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
