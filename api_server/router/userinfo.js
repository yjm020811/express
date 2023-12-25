const express = require("express");

const router = express.Router();

//导入用户路由函数的处理模块
const userInfoController = require("../controller/userinfo");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
//导入需要验证的规则对象
const { VerifyUpdate, VerifyPwd } = require("../verify/user");

//获取用户基本信息
router.get("/userinfo", userInfoController.getUserInfo);

//修改用户的基本信息
router.post(
  "/update",
  expressJoi(VerifyUpdate),
  userInfoController.updateUserInfo
);

//更新密码
router.post(
  "/resetPwd",
  expressJoi(VerifyPwd),
  userInfoController.updatePassword
);

module.exports = router;
