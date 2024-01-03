//导入数据库操作模块
const db = require("../db/index");

// 用户参加活动的处理函数
exports.joinActivity = (req, res) => {
  const { userId, activityId } = req.body;

  // 查询用户是否已经参加了特定的活动
  const checkQuery = `SELECT * FROM user_activity WHERE user_id = ? AND activity_id = ?`;

  db.query(checkQuery, [userId, activityId], (checkError, checkResults) => {
    if (checkError) {
      console.error(checkError);
      return res.status(500).json({ code: 500, message: "服务器错误" });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({ code: 0, message: "用户已经参加了该活动" });
    }

    // 用户未参加该活动，将参与信息插入到user_activity表中
    const insertQuery = `INSERT INTO user_activity (user_id, activity_id) VALUES (?, ?)`;

    db.query(
      insertQuery,
      [userId, activityId],
      (insertError, insertResults) => {
        if (insertError) {
          console.error(insertError);
          return res.status(500).json({ code: 0, message: "无法参加活动" });
        }

        // 成功参加活动
        return res.status(200).json({ code: 200, message: "成功参加活动！" });
      }
    );
  });
};

// 查询用户所参加的活动
exports.getUserActivities = (req, res) => {
  const { userId } = req.body; // 假设从请求体中获取用户ID

  const query = `SELECT activity_id FROM \`user_activity\` WHERE user_id = ?`;

  db.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ code: 500, message: "服务器错误" });
    }

    if (results.length === 0) {
      return res.status(200).json({ code: 0, message: "用户未参加任何活动" });
    }

    const activities = results.map((row) => row.activity_id);
    console.log(`123`, activities);
    const getActivityDetailsQuery = `SELECT * FROM activity WHERE id IN (?)`;
    db.query(getActivityDetailsQuery, [activities], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ code: 500, message: "无法获取活动详情" });
      }

      if (results.length === 0) {
        return res.status(200).json({ code: 0, message: "未找到相关活动数据" });
      }

      return res.status(200).json({ code: 200, activities: results });
    });
  });
};
