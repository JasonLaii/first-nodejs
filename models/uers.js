const User = require('../lib/mongo').User

module.exports = {
  //注册一个用户
  create: user=>{
    return User.create(user).exec()
  },

  //获取用户信息
  getUserInfo: name=>{
    return User.findOne({name : name}).addCreatedAt().exec()
  },
  getUserById: userId =>{
    return User.findOne({_id: userId}).exec();
  }
}