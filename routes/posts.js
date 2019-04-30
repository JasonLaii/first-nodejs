const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin


router.get('/',(req,res,next)=>{
  res.render('posts')
})

router.post('/create',checkLogin,(req,res,next)=>{
  res.send('发表文章')
})

router.get('/create',checkLogin,(req,res,next)=>{
  res.send('发表文章页')
})

router.get('/:postId',(req,res,next)=>{
  res.send('文章详情页')
})

router.get('/:postId/edit',checkLogin,(req,res,next)=>{
  res.send('更新文章页')
})

router.post('/:postId/edit',checkLogin,(req,res,next)=>{
  res.send('更新文章')
})

router.get('/:postId/remove',checkLogin,(req,res,next)=>{
  res.send('删除文章')
})

module.exports = router