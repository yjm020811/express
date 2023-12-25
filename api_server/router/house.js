//这是家政的路由模块
const express = require("express");
const router = express.Router();

//导入家政处理函数
const cleanController = require("../controller/house");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");

const {
  VerifyCleaners,
  VerifyUpdateCleaners,
  VerifyDeleteCleaners
} = require("../verify/house");

//获取家政数据的路由
router.get("/allCleaners", cleanController.getAllCleaners);

//新增家政
router.post(
  "/addCleaner",
  expressJoi(VerifyCleaners),
  cleanController.addCleaners
);

// 修改家政信息
router.post(
  "/updateCleaners",
  expressJoi(VerifyUpdateCleaners),
  cleanController.updateCleaners
);

// 删除家政信息
router.post(
  "/deleteCleaner",
  expressJoi(VerifyDeleteCleaners),
  cleanController.deleteCleaners
);

router.post("/findCleaner", cleanController.findCleaner);

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
const upload = multer({ storage: storage }).single("img");

// 添加家政的头像上传
router.post("/upload", upload, cleanController.uploadAvatar);

module.exports = router;
