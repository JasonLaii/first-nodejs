const express = require("express");
const router = express.Router();
const sha1 = require("sha1");

const checkNotLogin = require("../middlewares/check").checkNotLogin;
const UserModel = require("../models/uers");

router.get("/", checkNotLogin, (req, res, next) => {
  res.render("signin");
});

router.post("/", checkNotLogin, (req, res, next) => {
  // res.send('登陆')

  const name = req.fields.username;
  const password = req.fields.password;

  try {
    if (!(name.length)) {
      throw new Error("请输入账号");
    }
    if (!(password.length)) {
      throw new Error("请输入密码");
    }
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("back");
  }


  //little bug
  UserModel.getUserInfo(name)
    .then(user => {
      
      //bug
      if (!user) {
        req.flash("error", "用户不存在");
        return res.redirect("back");
      }
      
      //检查密码是否正确
      if (sha1(password) !== user.password) {
        req.flash("error", "用户名或密码错误");
        return res.redirect("back"); 
      }

      req.flash("success", "登录成功");

      delete user.password;

      //用户信息写入session
      req.session.user = user;

      res.redirect("/posts");
    })
    .catch(next);
});

module.exports = router;
