const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

router.get('/',checkLogin,(req,res,next)=>{
  // res.send('登出')

  //清空session中用户信息
  req.session.user = null
  req.flash('success','退出登录。')
  res.redirect('/posts')
})

module.exports = router