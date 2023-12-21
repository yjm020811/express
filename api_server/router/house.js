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

module.exports = router;
