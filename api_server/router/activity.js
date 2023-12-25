//这是活动分类的路由模块
const express = require("express");
const router = express.Router();

//导入活动处理函数
const activityController = require("../controller/activity");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");

//导入需要验证的规则对象
const {
  VerifyActivity,
  VerifyChangeActivity,
  VerifyDeleteActivity
} = require("../verify/activity");

//获取活动数据的路由
router.get("/allActivity", activityController.getAllActivities);

//新增活动的路由
router.post(
  "/addActivity",
  expressJoi(VerifyActivity),
  activityController.addActivity
);

//根据id修改活动信息的路由
router.post(
  "/changeActivity",
  expressJoi(VerifyChangeActivity),
  activityController.changeActivity
);

//删除活动
router.post(
  "/deleteActivity",
  expressJoi(VerifyDeleteActivity),
  activityController.deleteActivity
);

//活动名称模糊查询
router.post("/searchActivity", activityController.searchActivity);

module.exports = router;
