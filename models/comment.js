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
  getCommentbyCommentId: commentId =>{
    return Comment.findOne({_id: commentId}).exec()
  },

  //删除留言
  delComment: commentId=>{
    return Comment.deleteOne({_id: commentId}).exec()
  },

  //通过文章id获取留言数
  getCommentsCount: postId=>{
    // let count = Comment.count({post: postId}).exec()
    // console.log(count);
    return Comment.count({post: postId}).exec()
  },
  
  //删除一篇文章下的所有留言
  delComments: postId=>{
    Comment.find({postId: postId}
      ).forEach(comment=>{
        Comment.deleteOne({_id: comment._id})
    })
  },
  delComments : postId =>{
    return Comment.deleteMany({post: postId}).exec()
  }

}