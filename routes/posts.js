const express = require('express')
const router = express.Router()


const checkLogin = require('../middlewares/check').checkLogin

const PostModel = require('../models/post')


router.get('/',(req,res,next)=>{
  // res.render('posts')
  const author = req.query.author

  PostModel.getPosts(author)
      .then(posts=>{
        res.render('posts',{
          posts: posts
        })
      }).catch(next)
})

//发表文章页
router.get('/upload-article',checkLogin,(req,res,next)=>{
  res.render('upload-article')
})

router.post('/upload-article',checkLogin,(req,res,next)=>{
  // res.send('发表文章')

  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content

  try{
    if(!title){
      throw new Error("请输入标题！！")
    }
    if(!content){
      throw new Error("请输入正文！！")
    }
  }catch(e){
    req.flash('error',e.message)
    return res.redirect('back')
  }

  let post = {
    author : author,
    title : title,
    content : content
  }
  
  //写入数据库
  PostModel.uploadArticle(post)
    .then(result => {
      //此 post 是插入mongodb 后的值， 包含 _id
      post = result.ops[0];
      req.flash("success", "发表成功");
      //跳转到文章页
      res.redirect(`/posts/${post._id}`);
    })
    .catch(next);

})

router.get('/:postId',(req,res,next)=>{
  const postId = req.params.postId

  Promise.all([
    PostModel.getPostById(postId),
    PostModel.incPv(postId)
  ]).then(result=>{
    const post = result[0]

    if(!post){
      throw new Error('该文章不存在')
    }
    res.render('post-content',{
      post: post
    })
  }).catch(next)
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