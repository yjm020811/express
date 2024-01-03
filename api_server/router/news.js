//这是新闻的路由模块
const express = require("express");
const router = express.Router();

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

module.exports = router;
