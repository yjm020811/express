//导入数据库操作模块
const db = require("../db/index");

//获取所有活动的处理函数
exports.getAllActivities = (req, res) => {
  let sql = `SELECT * FROM activity`;

  if (req.query.limit) {
    const limit = parseInt(req.query.limit);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * limit;

    sql += ` LIMIT ${offset}, ${limit}`;
  }

  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ code: 0, msg: "获取活动数据失败", error: err });
    }

    res.send({
      code: 200,
      message: "获取活动数据成功",
      total: results.length,
      data: results
    });
  });
};

//新增活动的处理函数
exports.addActivity = (req, res) => {
  //定义查重的sql语句
  const sql = "select * from activity where activityName=?";
  //执行查重sql语句
  db.query(sql, [req.body.activityName], (err, results) => {
    //失败
    if (err) return res.send({ code: 0, msg: "新增活动失败" });
    // 成功
    if (results.length > 0) {
      return res.send({ code: 0, msg: "新增活动失败，活动名已存在" });
    } else {
      // 活动名不存在，可以新增活动

      // 定义插入活动的sql语句
      const sql =
        "insert into activity (activityName,activityDesc,address,activityStartTime,releaseTime) values (?,?,?,?,NOW())";

      // 执行插入活动的sql语句
      db.query(
        sql,
        [
          req.body.activityName,
          req.body.activityDesc,
          req.body.address,
          req.body.activityStartTime
        ],
        (err, results) => {
          // 失败
          if (err) {
            console.log(err);
            return res.send({ code: 0, msg: "新增活动失败" });
          }
          // 成功
          return res.send({ code: 200, msg: "新增活动成功" });
        }
      );
    }
  });
};

// 修改活动函数的信息
exports.changeActivity = (req, res) => {
  // 查询现有活动信息
  const selectSql = "SELECT * FROM activity WHERE id=?";
  db.query(
    selectSql,
    [
      req.body.id,
      req.body.activityName,
      req.body.activityDesc,
      req.body.address,
      req.body.activityStartTime
    ],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ code: 0, msg: "查询活动信息失败" });
      }
      if (results.length === 0) {
        return res.status(404).json({ code: 0, msg: "未找到要修改的活动" });
      }

      // 目前查出来的数据状态
      const existingActivity = results[0];
      console.log("根据传入id查出来的结果：", existingActivity);
      console.log(req.body);

      // 定义更新sql
      const updateSql =
        "UPDATE activity SET activityName=?, activityDesc=?, address=?, activityStartTime=? WHERE id=?";

      // 执行更新sql
      db.query(
        updateSql,
        [
          req.body.activityName,
          req.body.activityDesc,
          req.body.address,
          req.body.activityStartTime,
          req.body.id
        ],
        (err, updateResults) => {
          if (err || updateResults.affectedRows !== 1) {
            console.log(err);
            return res.status(500).json({ code: 0, msg: "修改活动失败" });
          }
          return res.status(200).json({ code: 200, msg: "修改活动成功" });
        }
      );
    }
  );
};

//删除活动
exports.deleteActivity = (req, res) => {
  console.log(req.body);
  // 定义删除sql
  const deleteSql = "DELETE FROM activity WHERE id=?";

  // 执行删除sql
  db.query(deleteSql, [req.body.id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ code: 0, msg: "删除活动失败" });
    }
    if (results.affectedRows !== 1) {
      return res.status(500).json({ code: 0, msg: "删除活动失败" });
    }
    return res.status(200).json({ code: 200, msg: "删除活动成功" });
  });
};

//根据活动名称模糊查询活动信息
exports.searchActivity = (req, res) => {
  // 定义模糊查询sql
  let querySql = "SELECT * FROM activity";

  // 如果 req.body.activityName 不为空，添加 WHERE 子句进行模糊查询
  if (req.body.activityName && req.body.activityName.trim() !== "") {
    querySql += " WHERE activityName LIKE ?";
    // 执行模糊查询sql
    db.query(querySql, [`%${req.body.activityName}%`], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(200).json({ code: 0, msg: "查询活动失败" });
      }
      if (results.length === 0) {
        return res.status(200).json({ code: 201, msg: "没有搜索到对应的活动" });
      }

      return res
        .status(200)
        .json({ code: 200, msg: "查询活动成功", data: results });
    });
  } else {
    // 如果 req.body.activityName 为空，直接返回表中所有数据
    db.query(querySql, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(200).json({ code: 0, msg: "查询活动失败" });
      }
      if (results.length === 0) {
        return res.status(500).json({ code: 201, msg: "活动表中无数据" });
      }

      return res
        .status(200)
        .json({ code: 200, msg: "查询活动成功", data: results });
    });
  }
};
