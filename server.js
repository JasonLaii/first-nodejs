const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
//?
const package = require('./package')

const winston = require('winston')
const expressWinston = require('express-winston')

const server = express()

//设置模板目录
server.set('views',path.join(__dirname,'views'))

//设置模板引擎
server.set('view engine', 'ejs')

//设置静态文件目录
server.use(express.static(path.join(__dirname,'public')))


//session中间件
server.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({
    url: config.mongodb
  })
}))

//flash中间件，用来显示通知
server.use(flash())

//处理表单及文件上传的中间件
server.use(require('express-formidable')({
  uploadDir: path.join(__dirname,'public/img'), //上传文件目录
  keepExtensions:true //保留后缀
}))

//设置模板全局常量
server.locals.blog = {
  title: 'myblog',
  bio: 'express-blog'
}


//添加模板必须的三个变量
server.use((req,res,next)=>{
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()  
})

//正常请求日志
server.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))

//记录正常请求日志文件要放在routes(server)之前
//错误请求日志要放在routes(server)之后

//路由
routes(server)

//错误请求日志
server.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}))


//将错误信息显示在通知面板
server.use((err,req,res,next)=>{
  console.log(err)
  req.flash('error',err.message)
  res.redirect('/posts')
})


if(module.parent){
  //被 require 导出 server
  module.exports = server
}else{
  //监听端口，启动程序
  server.listen(config.port,()=>{
    console.log(`${package.name} listening on port ${config.port}`)
  })

}
