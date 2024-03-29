//导入数据库操作模块
const db = require("../db/index");

//获取所有活动的处理函数
exports.getAllCleaners = (req, res) => {
  let sql = "select * from cleaners";

  if (req.query.limit) {
    const limit = parseInt(req.query.limit);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * limit;

    sql += ` LIMIT ${offset}, ${limit}`;
  }
  db.query(sql, (err, results) => {
    //失败
    if (err) {
      return res.send({ code: 0, msg: "获取家政数据失败", error: err });
    }
    //成功
    res.send({
      code: 200,
      message: "获取家政数据成功",
      total: results.length,
      data: results
    });
  });
};

// 新增家政的处理函数
exports.addCleaners = (req, res) => {
  console.log(req.body);
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
    [req.body.id, req.body.username, req.body.price, req.body.workTime],
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
        "UPDATE cleaners SET username=?, price=?, workTime=? WHERE id=?";
      // 执行更新操作
      db.query(
        updateSql,
        [req.body.username, req.body.price, req.body.workTime, req.body.id],
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

// 上传工作照avatar的处理函数
exports.uploadAvatar = (req, res) => {
  let file = req.file; // 图片对象
  let avatarLat = "/images/" + file.filename; // 图片名称
  let avatar = `http://localhost:3000${avatarLat}`;
  let id = req.body.id;

  const selectSql = "SELECT * FROM cleaners WHERE id = ?";
  db.query(selectSql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ code: 0, msg: "获取家政数据失败" });
    } else {
      if (results.length > 0) {
        let userAvatar = results[0].avatar;
        // 这是原始的照片

        const updateSql = "UPDATE cleaners SET avatar = ? WHERE id = ?";
        db.query(updateSql, [avatar, id], (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ code: 0, msg: "更新家政数据失败" });
          }

          // 返回成功的响应
          return res.status(200).json({
            code: 200,
            msg: "上传图片成功，并替换用户头像",
            data: { avatarUrl: avatar }
          });
        });
      } else {
        return res.status(404).json({ code: 0, msg: "未找到对应用户" });
      }
    }
  });
};

// 上传家政工作人员图片
exports.uploadCleanerAvatar = (req, res) => {
  const file = req.file; // 图片对象
  const avatarUrl = `http://localhost:3000/images/${file.filename}`;

  // 返回成功的响应，包含上传的新头像地址
  return res.status(200).json({
    code: 200,
    msg: "上传图片成功",
    data: { avatarUrl }
  });
};

//根据活动名称模糊查询活动信息
exports.findCleaner = (req, res) => {
  // 定义模糊查询sql
  let querySql = "SELECT * FROM cleaners";

  if (req.body.username && req.body.username.trim() !== "") {
    querySql += " WHERE username LIKE ?";
    // 执行模糊查询sql
    db.query(querySql, [`%${req.body.username}%`], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(200).json({ code: 0, msg: "查询家政人员失败" });
      }
      if (results.length === 0) {
        return res
          .status(200)
          .json({ code: 201, msg: "没有搜索到对应的家政人员" });
      }

      return res
        .status(200)
        .json({ code: 200, msg: "查询家政人员成功", data: results });
    });
  } else {
    // 如果 req.body.activityName 为空，直接返回表中所有数据
    db.query(querySql, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(200).json({ code: 0, msg: "查询家政人员失败" });
      }
      if (results.length === 0) {
        return res.status(500).json({ code: 201, msg: "家政表中无数据" });
      }

      return res
        .status(200)
        .json({ code: 200, msg: "查询家政人员成功", data: results });
    });
  }
};
