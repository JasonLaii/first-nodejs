const express = require("express");
const router = express.Router();

const checkLogin = require("../middlewares/check").checkLogin;
const CommentModel = require('../models/comment')
const PostModel = require('../models/post')
const UserModel = require('../models/uers')

//评论页
router.get("/:postId",(req,res,next)=>{
  // res.send("评论页")
  const postId = req.params.postId
  let arrAvatar = []
  
  PostModel.getPostById(postId)
    .then(post=>{
      CommentModel.getComments(postId)
      .then(comments=>{
        
            res.render("comment-page",{
              post: post,
              comments: comments,
              arrAvatar: arrAvatar})

              console.log(comments)
        })
    }).catch(next)

})

//发表评论
router.post("/:postId", checkLogin, (req, res, next) => {
  const post = req.params.postId
  const commentContent = req.fields.comment;
  const author = req.session.user._id;
  
  try{
    if(!commentContent){
      throw new Error("评论不能为空")
    }
  }catch(e){
    req.flash("error",e.message)
  }

  let comment = {
    post: post,
    author: author,
    commentContent: commentContent
  };

  //写入数据库
  CommentModel.leaveComment(comment)
    .then(result => {
      comment = result.ops[0];

      req.flash("success", "留言成功");
      res.redirect(`/posts`);
    })
    .catch(next);
});

//删除留言

//little bug
router.get("/:commentId/remove", checkLogin, (req, res, next) => {

  const commentId = req.params.commentId

      CommentModel.delComment(commentId)
        .then(() =>{
          req.flash('success','删除成功')
          res.redirect('back');
        })

});

module.exports = router;
