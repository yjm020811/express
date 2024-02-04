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

// 预约医生
router.post("/bookDoctor", userController.bookDoctorAppointment);

// 查看自己预约的医生
router.post("/findbookDoctor", userController.findbookDoctor);

// 预约家政
router.post("/bookClean", userController.bookHomeAppointment);

// 查看自己预约的家政
router.post("/findbookClean", userController.findbookHome);

// 用户微信登录
router.post("/wxlogin", userController.loginByWechat);

// 获取用户个人信息
router.post("/getProfile", userController.getUserInfo);

// 将自己的信息存储到数据库
router.post("/saveProfile", userController.saveUserInfo);
// 管理员获取用户列表
router.get("/getUserList", userController.getOldUseList);

// 修改个人信息
router.post("/editProfile", userController.editUserInfo);

// 删除个人信息
router.post("/deleteProfile", userController.deleteUserById);

module.exports = router;
