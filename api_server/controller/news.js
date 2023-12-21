//导入数据库操作模块
const db = require("../db/index");

//获取所有新闻的处理函数
exports.getAllNews = (req, res) => {
  const sql = "select * from news";
  db.query(sql, (err, results) => {
    //失败
    if (err) return res.send({ code: 0, msg: "获取新闻数据失败" });
    //成功
    res.send({ code: 200, message: "获取新闻数据成功", data: results });
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
        "insert into news (newsName,newsContent,img,releaseTime) values  (?,?,?,?)";

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
