//这是新闻的路由模块
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

//导入新闻处理函数
const newsController = require("../controller/news");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");

const {
  VerifyNews,
  VerifyUpdateNews,
  VerifyDeleteNews
} = require("../verify/news");

//获取新闻数据的路由
router.get("/newsList", newsController.getAllNews);

//新增新闻
router.post("/addNews", expressJoi(VerifyNews), newsController.addNews);

// 修改新闻信息
router.post(
  "/updateNews",
  expressJoi(VerifyUpdateNews),
  newsController.updateNews
);

// 删除新闻信息
router.post(
  "/deleteNews",
  expressJoi(VerifyDeleteNews),
  newsController.deleteNews
);

router.post("/findNews", newsController.findNewsByName);

router.get("/findNewsById", newsController.findNewsById);

// 上传新闻图片
router.post("/uploadNewsPic", upload, newsController.uploadNewsImage);

module.exports = router;
