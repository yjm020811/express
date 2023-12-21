//导入数据库操作模块
const db = require("../db/index");
//导入bcryptjs的加密的包
const bcrypt = require("bcryptjs");
//导入生成token的包
const jwt = require("jsonwebtoken");
// 导入全局配置
const config = require("../config");

//注册用户的路由处理函数
exports.registerUser = (req, res) => {
  const userInfo = req.body;

  const sql1 = "SELECT * FROM admin WHERE username=?";
  db.query(sql1, userInfo.username, (err, result) => {
    if (err) {
      return res.send({ code: 0, msg: err.message });
    }

    if (result.length > 0) {
      return res.send({ code: 0, msg: "用户名已被占用" });
    }

    // If the username is available, hash the password and insert the new user
    userInfo.password = bcrypt.hashSync(userInfo.password, 10);
    const sql2 = "INSERT INTO admin SET ?";
    db.query(
      sql2,
      {
        username: userInfo.username,
        password: userInfo.password,
        phone: userInfo.phone,
        avatar: userInfo.avatar
      },
      (err, result) => {
        if (err) {
          return res.send({ code: 0, msg: err.message });
        }

        if (result.affectedRows !== 1) {
          return res.send({ code: 0, msg: "注册失败" });
        }

        res.send({ code: 200, msg: "注册成功" });
      }
    );
  });
};

//登录的处理函数
exports.loginUser = (req, res) => {
  //1.检测表单数据是否合法
  //2.根据用户名查询用户的数据
  //获取前端端提交到后端的用户信息
  const userInfo = req.body;
  const sql = "select * from admin where username=?";
  db.query(sql, userInfo.username, (err, result) => {
    if (err) return res.send({ code: 0, msg: "登陆失败" });
    if (result.length !== 1) return res.send({ code: 0, msg: "登录失败" });
    //3.判断用户输入的密码是否正确
    //使用bcrypt.compareSync比较密码是否一致(第一个参数:用户提交的密码,第二个参数:数据库中的密码)
    const compareResult = bcrypt.compareSync(
      userInfo.password,
      result[0].password
    );
    //比较失败,密码输入错误
    if (!compareResult) {
      return res.send({ code: 0, msg: "密码错误" });
    } else {
      //4.生成JWT的Token字段,生成token的时候,要剔除密码和头像的值
      const user = { ...result[0], password: "", avatar: "" };
      //对用户信息进行加密,生成token
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: "10h"
      });
      //响应
      return res.send({
        code: 200,
        msg: "登陆成功",
        token: "Bearer " + tokenStr
      });
    }
  });
};
