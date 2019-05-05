const Post = require("../lib/mongo").Post;
const marked = require("marked");

//将 markdown 解析成 html
Post.plugin("contentToHtml", {
  afterFind: posts => {
    return posts.map(post => {
      post.content = marked(post.content);
      return post;
    });
  },
  afterFindOne: post => {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  }
});

module.exports = {
  //上传一篇文章
  uploadArticle: post => {
    // create is a method of mongolass.model
    return Post.create(post).exec();
  },


  //通过文章id获取文章
  getPostById: postId => {
    return Post.findOne({ _id: postId })
      .populate({ path: "author", model: "User" })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },

  //获取不经过markdown解析的内容
  getRawPostById: postId =>{
    return Post.findOne({ _id: postId })
      .populate({path:"author",model:"User"})
      .exec()
  },

  //获取文章
  getPosts: function getPosts(author) {
    const query = {};
    if (author) {
      query.author = author;
    }
    return Post.find(query)
      .populate({ path: "author", model: "User" })
      .sort({ _id: -1 })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },

  //编辑文章
  editPost: (postId, updatePost) => {
    return Post.updateOne({ _id: postId }, {$set: updatePost}).exec();
  },

  //删除文章
  delPost: postId => {
    return Post.deleteOne({ _id: postId })
      .exec()
      .then(() => console.log("deleted."));
  },
  //浏览量
  incPv: function incPv(postId) {
    return Post.update({ _id: postId }, { $inc: { pv: 1 } }).exec();
  }
};
