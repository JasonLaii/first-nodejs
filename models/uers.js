const User = require('../lib/mongo').User

module.exports = {
  //注册一个用户
  create: function create(user){
    return User.create(user).exec()
  },

  //获取用户信息
  getUserInfo: function getUserInfo(name){
    return User.findOne({name : name}).addCreatedAt().exec()
  }
}