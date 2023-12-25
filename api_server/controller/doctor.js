//导入数据库操作模块
const db = require("../db/index");

//获取所有医生的事件处理函数
exports.getAllDoctors = (req, res) => {
  let sql = "select * from doctor";

  if (req.query.limit) {
    const limit = parseInt(req.query.limit);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * limit;

    sql += ` LIMIT ${offset}, ${limit}`;
  }
  db.query(sql, (err, results) => {
    //失败
    if (err) {
      return res.send({ code: 0, msg: "获取医生数据失败", error: err });
    }
    //成功
    res.send({
      code: 200,
      message: "获取医生数据成功",
      total: results.length,
      data: results
    });
  });
};

// 新增医生
exports.addDoctor = (req, res) => {
  //定义查重的sql语句
  const sql = "select * from doctor where username=?";
  db.query(sql, [req.body.username], (err, results) => {
    console.log(results);
    if (err) return res.send({ code: 0, msg: "新增医生失败" });
    // 成功
    if (results.length > 0) {
      return res.send({ code: 0, msg: "新增医生失败，已存在这名医生" });
    } else {
      //医生不存在，开始新增
      const sql =
        "insert into doctor(username,price,treatmentTime,affiliatedHospital) values  (?,?,?,?)";

      // 执行插入活动的sql语句
      db.query(
        sql,
        [
          req.body.username,
          req.body.price,
          req.body.treatmentTime,
          req.body.affiliatedHospital
        ],
        (err, results) => {
          // 失败
          if (err) {
            console.log(err);
            return res.send({ code: 0, msg: "新增医生失败" });
          }
          // 成功
          return res.send({ code: 200, msg: "新增医生成功" });
        }
      );
    }
  });
  // 执行sql语句
};

// 修改医生信息
exports.updateDoctor = (req, res) => {
  // 定义修改的sql语句
  const sql = "SELECT * FROM doctor WHERE id=?";
  console.log(req.body);
  // 执行sql语句
  db.query(sql, [req.body.id], (err, results) => {
    if (err) {
      console.log(results);
      return res.status(500).json({ code: 0, msg: "查询医生信息失败" });
    }
    if (results.length === 0) {
      return res.status(404).json({ code: 0, msg: "未找到要修改的医生信息" });
    }

    //  定义更新sql
    const updateSql =
      "UPDATE doctor SET username=?, price=?, treatmentTime=?, affiliatedHospital=? WHERE id=?";
    // 执行更新操作
    db.query(
      updateSql,
      [
        req.body.username,
        req.body.price,
        req.body.treatmentTime,
        req.body.affiliatedHospital,
        req.body.id
      ],
      (err, updateResults) => {
        if (err || updateResults.affectedRows !== 1) {
          console.log(err);
          return res.status(500).json({ code: 0, msg: "修改医生信息失败" });
        }
        return res.status(200).json({ code: 200, msg: "修改医生信息成功" });
      }
    );
  });
};

//根据id删除医生
exports.deleteDoctor = (req, res) => {
  const sql = "DELETE FROM doctor WHERE id=?";
  db.query(sql, [req.body.id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ code: 0, msg: "删除医生信息失败" });
    }
    if (results.affectedRows !== 1) {
      return res.status(500).json({ code: 0, msg: "未找到要删除的医生信息" });
    }
    return res.status(200).json({ code: 200, msg: "删除医生信息成功" });
  });
};

//根据医生姓名模糊查询
exports.searchDoctor = (req, res) => {
  if (!req.body.username) {
    const sql =
      "SELECT id, username, price, treatmentTime, affiliatedHospital FROM doctor";
    db.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ code: 0, msg: "查询医生信息失败" });
      }
      return res
        .status(200)
        .json({ code: 200, msg: "查询医生信息成功", data: results });
    });
  } else {
    const sql =
      "SELECT id, username, price, treatmentTime, affiliatedHospital FROM doctor WHERE username LIKE ?";
    db.query(sql, ["%" + req.body.username + "%"], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ code: 0, msg: "查询医生信息失败" });
      }
      return res
        .status(200)
        .json({ code: 200, msg: "查询医生信息成功", data: results });
    });
  }
};
