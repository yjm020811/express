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

exports.loginUser = (req, res) => {
  const userInfo = req.body;
  const sql =
    "SELECT id, username, password, avatar FROM admin WHERE username=?";

  db.query(sql, userInfo.username, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ code: 0, msg: "登录失败" });
    }

    if (result.length !== 1) {
      return res.status(401).json({ code: 0, msg: "登录失败" });
    }

    const user = result[0];
    const compareResult = bcrypt.compareSync(userInfo.password, user.password);

    if (!compareResult) {
      return res.status(401).json({ code: 0, msg: "密码错误" });
    } else {
      const { id, username, avatar } = user; // Extracting needed user data
      const userWithoutSensitiveData = { id, username, avatar }; // Excluding sensitive data

      const tokenStr = jwt.sign(userWithoutSensitiveData, config.jwtSecretKey, {
        expiresIn: "10h"
      });

      return res.status(200).json({
        code: 200,
        msg: "登陆成功",
        token: "Bearer " + tokenStr,
        userId: id // Adding the user ID in the response
      });
    }
  });
};
