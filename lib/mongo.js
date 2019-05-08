const config = require("config-lite")(__dirname);
const Mongolass = require("mongolass");
const mongolass = new Mongolass();

const moment = require("moment");
//根据Object生成时间戳
const objectIdToTimestamp = require("objectid-to-timestamp");

mongolass.connect(config.mongodb);

//users models
exports.User = mongolass.model("User", {
  name: { type: "string", required: true },
  password: { type: "string", required: true },
  avatar: { type: "string", required: true },
  gender: { type: "string", enum: ["m", "f", "x"], default: "x" },
  bio: { type: "string", required: true }
});

//post models
exports.Post = mongolass.model("Post",{
  author: {type:Mongolass.Types.ObjectId , required:true},
  title: { type:"string",required:true},
  content: {type:"string",required:true},
  //点击量
  pv: {type: 'number',default: 0}
})

//comment models
exports.Comment = mongolass.model('Comment',{
  post: {type:Mongolass.Types.ObjectId, required: true},
  author: {type: Mongolass.Types.ObjectId, required: true},
  commentContent: {type: "string",required:true}
})

//根据 id 生成创建时间 created_at
mongolass.plugin("addCreatedAt", {
  afterFind: results => {
    results.forEach(item => {
      item.created_at = moment(objectIdToTimestamp(item._id)).format(
        "YYYY-MM-DD HH:mm"
      );
    });
    return results;
  },
  afterFindOne: result => {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format(
        "YYYY-MM-DD HH:mm"
      );
    }
    return result
  }
});



//按创建时间降序查找用户的文章列表
exports.Post.index({author: 1,_id: -1}).exec()

//根据用户名找到用户，用户名全局唯一
exports.User.index({ name: 1 }, { unique: true }).exec();

//通过文章id获取该文章下所有的留言，按留言创建时间升序
exports.Comment.index({postId: 1, _id:-1}).exec()