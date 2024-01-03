//这是用户的路由模块
const express = require("express");
const router = express.Router();

//导入用户处理函数
const userController = require("../controller/olduser");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");

const { VerifyJoinActivity } = require("../verify/olduser");

// 参加活动
router.post(
  "/joinAct",
  expressJoi(VerifyJoinActivity),
  userController.joinActivity
);

// 查看自己所参加的活动
router.post("/findJoinAct", userController.getUserActivities);

module.exports = router;
