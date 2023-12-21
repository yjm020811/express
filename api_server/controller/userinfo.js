//导入数据库操作模块
const db = require("../db/index");
//导入对密码加密的包
const bcrypt = require("bcryptjs");

//获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  //定义查询用户信息的sql语句
  const sql = "select username,phone,avatar from admin where id = ?";
  //调用db.query( )执行sql语句
  db.query(sql, req.auth.id, (err, result) => {
    //执行sql失败
    console.log(req);
    if (err) return res.send({ code: 0, msg: "查询管理员信息失败" });
    //执行sql成功,但查询结果为空
    if (result.length !== 1) res.send({ code: 0, msg: "没有查询到该管理员" });
    //成功
    res.send({ code: 200, message: "用户信息获取成功", data: result[0] });
  });
};

//修改用户的基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  //定义修改用户信息的sql语句
  const sql = "update admin set username = ?,phone = ? where id = ?";
  console.log(req.body);
  //调用db.query( )执行sql语句
  db.query(
    sql,
    [req.body.username, req.body.phone, req.body.id],
    (err, result) => {
      console.log(result);
      if (err) return res.send({ code: 0, msg: "更新用户信息失败" });
      // 执行sql语句成功,但影响行数不等于1
      if (result.affectedRows !== 1)
        return res.send({ code: 0, msg: "更新用户信息失败" });
      //成功
      return res.send({ code: 200, msg: "更新用户信息成功" });
    }
  );
};

//更新密码
exports.updatePassword = (req, res) => {
  const sql = " select * from admin where id = ?";
  db.query(sql, req.auth.id, (err, result) => {
    if (err) return res.send({ code: 0, msg: "更新密码失败" });
    //判断用户是否存在
    if (result.length !== 1) return res.send({ code: 0, msg: "用户不存在" });
    //TODO:判断用户的旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPassword,
      result[0].password
    );
    if (!compareResult) {
      return res.send({ code: 0, msg: "旧密码不正确" });
    } else {
      const sql = "update admin set password = ? where id = ?";
      const newPwd = bcrypt.hashSync(req.body.newPassword, 10);
      db.query(sql, [newPwd, req.auth.id], (err, result) => {
        if (err) return res.send({ code: 0, msg: "更新密码失败" });
        if (result.affectedRows !== 1)
          return res.send({ code: 0, msg: "更新密码失败" });
        return res.send({ code: 200, msg: "密码更新成功" });
      });
    }
  });
};
