//这是医生的路由模块
const express = require("express");
const router = express.Router();

//导入医生处理函数
const doctorController = require("../controller/doctor");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");

// //导入需要验证的规则对象
const {
  VerifyDoctor,
  VerifyChangeDoctor,
  VerifyDeleteDoctor
} = require("../verify/doctor");

//获取活动数据的路由
router.get("/allDoctor", doctorController.getAllDoctors);
//新增医生的路由
router.post("/addDoctor", expressJoi(VerifyDoctor), doctorController.addDoctor);
//修改医生信息
router.post(
  "/updateDoctor",
  expressJoi(VerifyChangeDoctor),
  doctorController.updateDoctor
);

//删除医生
router.post(
  "/deleteDoctor",
  expressJoi(VerifyDeleteDoctor),
  doctorController.deleteDoctor
);

//模糊查询
router.post("/findDoctor", doctorController.searchDoctor);

module.exports = router;
