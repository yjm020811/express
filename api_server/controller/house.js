//导入数据库操作模块
const db = require("../db/index");

//获取所有活动的处理函数
exports.getAllCleaners = (req, res) => {
  const sql = "select * from cleaners";
  db.query(sql, (err, results) => {
    //失败
    if (err) return res.send({ code: 0, msg: "获取家政数据失败" });
    //成功
    res.send({ code: 200, message: "获取家政数据成功", data: results });
  });
};

// 新增家政的处理函数
exports.addCleaners = (req, res) => {
  const sql = "select * from cleaners where username=?";
  db.query(sql, [req.body.username], (err, results) => {
    console.log(results);
    if (err) return res.send({ code: 0, msg: "新增家政失败" });
    // 成功
    if (results.length > 0) {
      return res.send({ code: 0, msg: "新增家政失败，已存在这名家政" });
    } else {
      // 执行插入活动的sql语句
      const sql =
        "insert into cleaners (username,price,workTime,avatar) values  (?,?,?,?)";

      // 执行插入活动的sql语句
      db.query(
        sql,
        [req.body.username, req.body.price, req.body.workTime, req.body.avatar],
        (err, results) => {
          // 失败
          if (err) {
            console.log(err);
            return res.send({ code: 0, msg: "新增家政失败" });
          }
          // 成功
          return res.send({ code: 200, msg: "新增家政成功" });
        }
      );
    }
  });
};

// 修改家政信息的处理函数
exports.updateCleaners = (req, res) => {
  // 定义修改的sql语句
  const sql = "SELECT * FROM cleaners WHERE id=?";
  // 执行sql语句
  db.query(
    sql,
    [
      req.body.id,
      req.body.username,
      req.body.price,
      req.body.workTime,
      req.body.avatar
    ],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ code: 0, msg: "查询家政信息失败" });
      }
      if (results.length === 0) {
        return res.status(404).json({ code: 0, msg: "未找到要修改的家政信息" });
      }

      //  定义更新sql
      const updateSql =
        "UPDATE cleaners SET username=?, price=?, workTime=?, avatar=? WHERE id=?";
      // 执行更新操作
      db.query(
        updateSql,
        [
          req.body.username,
          req.body.price,
          req.body.workTime,
          req.body.avatar,
          req.body.id
        ],
        (err, updateResults) => {
          if (err || updateResults.affectedRows !== 1) {
            console.log(err);
            return res.status(500).json({ code: 0, msg: "修改家政信息失败" });
          }
          return res.status(200).json({ code: 200, msg: "修改家政信息成功" });
        }
      );
    }
  );
};

//删除家政信息的处理函数
exports.deleteCleaners = (req, res) => {
  const sql = "DELETE FROM cleaners WHERE id=?";
  db.query(sql, [req.body.id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ code: 0, msg: "删除家政信息失败" });
    }
    if (results.affectedRows !== 1) {
      return res.status(500).json({ code: 0, msg: "未找到要删除的家政信息" });
    }
    return res.status(200).json({ code: 200, msg: "删除家政信息成功" });
  });
};
