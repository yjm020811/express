//导入数据库操作模块
const db = require("../db/index");

//获取所有新闻的处理函数
exports.getAllNews = (req, res) => {
  let sql = `SELECT * FROM news`;

  if (req.query.limit) {
    const limit = parseInt(req.query.limit);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * limit;
    sql += ` LIMIT ${offset}, ${limit}`;
  }

  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ code: 0, msg: "获取新闻数据失败", error: err });
    }

    res.send({
      code: 200,
      message: "获取新闻数据成功",
      total: results.length,
      data: results
    });
  });
};

// 新增新闻的处理函数
exports.addNews = (req, res) => {
  const sql = "select * from news where newsName=?";
  db.query(sql, [req.body.newsName], (err, results) => {
    console.log(results);
    if (err) return res.send({ code: 0, msg: "新增新闻失败" });
    // 成功
    if (results.length > 0) {
      return res.send({ code: 0, msg: "新增新闻失败，新闻已存在" });
    } else {
      // 执行插入活动的sql语句
      const sql =
        "insert into news (newsName,newsContent,img,releaseTime) values  (?,?,?,NOW())";

      // 执行插入活动的sql语句
      db.query(
        sql,
        [
          req.body.newsName,
          req.body.newsContent,
          req.body.img,
          req.body.releaseTime
        ],
        (err, results) => {
          // 失败
          if (err) {
            console.log(err);
            return res.send({ code: 0, msg: "新增新闻失败" });
          }
          // 成功
          return res.send({ code: 200, msg: "新增新闻成功" });
        }
      );
    }
  });
};

// 修改新闻信息的处理函数
exports.updateNews = (req, res) => {
  // 定义修改的sql语句
  const sql = "SELECT * FROM news WHERE id=?";
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
        return res.status(500).json({ code: 0, msg: "查询新闻信息失败" });
      }
      if (results.length === 0) {
        return res.status(404).json({ code: 0, msg: "未找到要修改的新闻信息" });
      }

      //  定义更新sql
      const updateSql =
        "UPDATE news SET newsName=?, newsContent=?, img=?, releaseTime=? WHERE id=?";
      // 执行更新操作
      db.query(
        updateSql,
        [
          req.body.newsName,
          req.body.newsContent,
          req.body.img,
          req.body.releaseTime,
          req.body.id
        ],
        (err, updateResults) => {
          if (err || updateResults.affectedRows !== 1) {
            console.log(err);
            return res.status(500).json({ code: 0, msg: "修改新闻信息失败" });
          }
          return res.status(200).json({ code: 200, msg: "修改新闻信息成功" });
        }
      );
    }
  );
};

//删除新闻信息的处理函数
exports.deleteNews = (req, res) => {
  const sql = "DELETE FROM news WHERE id=?";
  db.query(sql, [req.body.id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ code: 0, msg: "删除新闻信息失败" });
    }
    if (results.affectedRows !== 1) {
      return res.status(500).json({ code: 0, msg: "未找到要删除的新闻信息" });
    }
    return res.status(200).json({ code: 200, msg: "删除新闻信息成功" });
  });
};

// 根据名字查询
// 假设这是一个 Express.js 路由处理程序，并且在路由中使用了 req 和 res 对象
exports.findNewsByName = (req, res) => {
  // 定义模糊查询sql
  let querySql = "SELECT * FROM news";

  // 如果 req.body.newsName 不为空，添加 WHERE 子句进行模糊查询
  if (req.body.newsName && req.body.newsName.trim() !== "") {
    querySql += " WHERE newsName LIKE ?";
    // 执行模糊查询sql，使用参数化查询防止 SQL 注入攻击
    db.query(querySql, [`%${req.body.newsName}%`], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ code: 0, msg: "查询新闻失败" });
      }
      if (results.length === 0) {
        return res.status(200).json({ code: 201, msg: "没有搜索到对应的新闻" });
      }

      return res
        .status(200)
        .json({ code: 200, msg: "查询新闻成功", data: results });
    });
  } else {
    // 如果 req.body.newsName 为空，直接返回表中所有数据
    db.query(querySql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ code: 0, msg: "查询新闻失败" });
      }
      if (results.length === 0) {
        return res.status(200).json({ code: 201, msg: "新闻表中无数据" });
      }

      return res
        .status(200)
        .json({ code: 200, msg: "查询新闻成功", data: results });
    });
  }
};

exports.findNewsById = (req, res) => {
  // 确保请求中包含要查询的新闻ID
  if (!req.query.newsId) {
    return res.status(400).json({ code: 0, msg: "未提供新闻ID" });
  }

  // 定义查询指定ID的新闻的 SQL 语句
  let querySql = "SELECT * FROM news WHERE id = ?";

  // 执行 SQL 查询，并使用参数化查询防止 SQL 注入攻击
  db.query(querySql, [req.query.newsId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ code: 0, msg: "查询新闻失败" });
    }
    if (results.length === 0) {
      return res.status(200).json({ code: 201, msg: "没有找到对应的新闻" });
    }

    return res
      .status(200)
      .json({ code: 200, msg: "查询新闻成功", data: results[0] });
    // 注意：这里假设只有一条符合条件的新闻数据，所以直接返回 results[0]
    // 如果可能存在多条符合条件的新闻数据，需要考虑返回一个数组 results
  });
};
