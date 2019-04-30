module.exports ={
  port: 8080,
  //express-session 配置信息
  session:{
    secret: 'express-blog',
    key: 'express-blog',
    maxAge: 2592000000
  },
  //mongodb地址，以mongodb://协议开头,express-blog为db名
  mongodb: 'mongodb://localhost:27017/users'
}