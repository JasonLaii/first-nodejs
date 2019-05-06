const Comment = require('../lib/mongo').Comment

module.exports = {


  // 留下评论
  leaveComment: comment =>{
    return Comment.create(comment)
      .addCreatedAt()
      .exec()
  },
  
  //获取所有留言
  getComments: postId =>{

    // const 
    return Comment.find({post: postId})
      .exec()
  }
  //删除留言


}