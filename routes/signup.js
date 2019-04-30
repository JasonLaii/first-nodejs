const fs = require('fs')
const path= require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/uers')

const checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/',checkNotLogin,(req,res,next)=>{
  res.render('signup')
})

router.post('/',checkNotLogin,(req,res,next)=>{
  // res.send('注册')
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  const avatar = req.files.avatar.path.split(path.sep).pop()
  let password = req.fields.password
  const repassword = req.fields.repassword

  try {
    if(!(name.length >=1 && name.length <= 10)){
      throw new Error('名字请限制在 1-10 个字符长度内')
    }
    if(['m','f','x'].indexOf(gender) === -1){
      throw new Error('性别错误')
    }
    if(password != repassword){
      throw new Error('两次输入的密码不一致')
    }
    if(!req.files.avatar){
      throw new Error('缺少头像')
    }
    if(password.length <  6){
      throw new Error('密码长度不得小于6位')
    }
    if(!(bio.length >=1 && bio.length <=30)){
      throw new Error('个人简介限制在1-30个字符内')
    }
  }catch(e){
    //注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path)
    req.flash('error',e.message)
    return res.redirect('/signup')
  }

  //密码加密
  password = sha1(password)

  //待写入数据库的用户信息
  let user = {
    name:name,
    password:password,
    avatar:avatar,
    gender:gender,
    bio:bio
  }

  //用户信息写入数据库
  UserModel.create(user)
    .then(function(result){
      //此user 是 插入 mongodb后的值， 包含 _id
      user = result.ops[0]
      //删除密码这种敏感信息，将用户信息传入session
      delete user.password
      req.session.user = user
      //写入 flash
      req.flash('success','注册成功')
      //跳转到首页
      res.redirect('/posts')
    })
    .catch(function(e){
      //注册失败，异步删除上传的头像
      fs.unlink(req.fields.avatar.path)
      //用户名被占用跳回注册页
      if(e.message.match('duplicate key')){
        req.flash('error','用户名已被占用')
        return res.redirect('/signup')
      }
      next(e)
    })

})

module.exports = router