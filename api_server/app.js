//导入express
const express = require("express");
//创建服务器的实例对象
const app = express();
const path = require("path");

//导入验证数据的中间件
const joi = require("joi");

//导入并配置cors中间件
const cors = require("cors");
app.use(cors());

//配置解析表单数据(application/x-www-form-urlencoded)的中间件
app.use(express.urlencoded({ extended: false }));
//配置json格式
app.use(express.json());

//一定要在路由之前配置解析token的中间件
// const { expressjwt: expressJWT } = require("express-jwt");
// const config = require("./config");

// app.use(
//   expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
//     //没有身份认证拿到token就只能访问以api/my开头的接口
//     path: [/^\/api\//, /^\/my\//]
//   })
// );

// 导入并使用user路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);
//导入并使用用户信息的路由模块
const userInfoRouter = require("./router/userinfo");
app.use("/my", userInfoRouter);
//导入并使用活动的路由模块
const activityRouter = require("./router/activity");
app.use("/my/activity", activityRouter);
//导入并使用医生的路由模块
const doctorRouter = require("./router/doctor");
app.use("/my/doctor", doctorRouter);
//导入并使用家政的路由模块
const houseRouter = require("./router/house");
app.use("/my/house", houseRouter);
//导入并使用新闻的路由模块
const newsRouter = require("./router/news");
app.use("/my/news", newsRouter);
//导入老年用户的路由模块
const oldUser = require("./router/olduser");
app.use("/my/olduser", oldUser);
//  读取本地图片
app.use(express.static(path.join(__dirname, "public/")));

//定义错误中间件
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError)
    return res.send({ code: 0, msg: "数据校验失败" });
  if (err.name === "UnauthorizedError")
    return res.send({ code: 0, msg: "身份认证失败" });
  res.send({ code: 500, msg: err.message });
});

//启动服务器
app.listen(3000, (req, res) => {
  console.log("服务器启动成功");
});
