const express = require("express");

const router = express.Router();

//导入用户路由函数的处理模块
const userController = require("../controller/user");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
//导入需要验证的规则对象
const { VerifyRegister, VerifyLogin } = require("../verify/user");

//注册
router.post(
  "/register",
  expressJoi(VerifyRegister),
  userController.registerUser
);

//登录
router.post("/login", expressJoi(VerifyLogin), userController.loginUser);

module.exports = router;
