const Comment = require('../lib/mongo').Comment
const Post = require('../lib/mongo').Post

module.exports = {


  // 留下评论
  leaveComment: comment =>{
    return Comment.create(comment)
      .exec()
  },
  //获取所有留言
  getComments: postId =>{

    return Comment.find({post: postId})
      .addCreatedAt()
      .exec()
  },
  //获取文章信息
  getPostbyCommentId: commentId =>{
    return Post.findOne({_id: commentId})
      .exec()
  },
  //删除留言
  delComment: commentId=>{
    return Comment.deleteOne({_id: commentId}).exec()

  }

}