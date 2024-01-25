//这是医生的路由模块
const express = require("express");
const router = express.Router();

// 关于multer的配置
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  // 文件名
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
// single("img"); 支持一演上传一张图，请求体里面的 参数名img，参数的值 图片
const upload = multer({ storage }).single("img");

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

// 修改医生头像
router.post("/upload", upload, doctorController.uploadPhoto);

//添加新医生的头像
router.post("/addPhoto", upload, doctorController.uploadDoctorAva);

module.exports = router;
