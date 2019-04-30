const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/',checkNotLogin,(req,res,next)=>{
  res.render('signin')

})

router.post('/',checkNotLogin,(req,res,next)=>{
  // res.send('登陆')
  if(req.session.user){
    req.flash('success','登录成功')
  }else{
    req.flash('error','登录失败')
    res.redirect('/signin')
  }
})

module.exports = router