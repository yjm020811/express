//导入数据库操作模块
const db = require("../db/index");
const request = require("request");
var WXBizDataCrypt = require("../public/WXBizDataCrypt");

//全局变量
let sessionKey = null;
let openid = null;

// 用户微信登录
exports.loginByWechat = (req, res) => {
  const { code } = req.body;

  // 调用微信API获取用户信息
  const wxAppId = "wxf2795e193b6c5d02";
  const wxAppSecret = "5e1455f49134b7226f20a33d3912090a";
  const wxLoginUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxAppId}&secret=${wxAppSecret}&js_code=${code}&grant_type=authorization_code`;
  request(wxLoginUrl, (error, response, body) => {
    console.log(response);
    if (response.statusCode == 200) {
      sessionKey = JSON.parse(body).session_key;
      openid = JSON.parse(body).openid;
      return res.status(200).json({
        code: 200,
        message: "登录成功",
        openid: openid,
        sessionKey: sessionKey
      });
    }
  });
};

// 获取用户个人信息
exports.getUserInfo = (req, res) => {
  let reqData = req.body;
  let bizDataCrypt = new WXBizDataCrypt("wxf2795e193b6c5d02", sessionKey);

  const encryptedDataBuffer = Buffer.from(reqData.encryptedData, "base64");
  const ivBuffer = Buffer.from(reqData.iv, "base64");

  const data = bizDataCrypt.decryptData(encryptedDataBuffer, ivBuffer);
  console.log(data);
  return res.status(200).json({
    code: 200,
    message: "获取用户信息成功",
    data: data
  });
};

//将获取到的用户信息存储到数据库
exports.saveUserInfo = (req, res) => {
  const isExistQuery = "SELECT * FROM users WHERE nickName = ?";
  db.query(isExistQuery, [req.body.nickName], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "查询用户时发生错误" });
    }

    if (result.length > 0) {
      const userId = result[0].id; // 假设用户表中的 ID 字段是 'id'

      return res.status(200).json({
        message: "用户已存在",
        userId: userId // 返回用户 ID
      });
    }

    // 如果用户不存在
    const insertQuery =
      "INSERT INTO users (phoneNumber, avatar, nickName) VALUES (?, ?, ?)";
    db.query(
      insertQuery,
      [req.body.phoneNumber, req.body.avatar, req.body.nickName],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: "保存用户信息时发生错误" });
        }
        // console.log(res);
        const id = results.insertId;
        console.log(id);
        return res.status(200).json({
          message: "用户信息保存成功",
          userId: id // 将用户 ID 添加到响应中
        });
      }
    );
  });
};

// 获取用户的列表
exports.getOldUseList = (req, res) => {
  // 查询数据库中的用户列表
  const query = `SELECT * FROM users`;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error retrieving user list:", err);
      return res.status(500).json({ message: "Error retrieving user list" });
    }
    console.log(result);
    return res.send({ code: 200, data: result });
  });
};

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

// 预约医生并获取预约时间的处理函数
exports.bookDoctorAppointment = (req, res) => {
  const { user_id, doctor_id } = req.body;

  // 获取当前时间作为预约时间
  const appointment_date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // 查询用户是否已经预约了特定的医生在指定日期的预约
  const checkQuery = `SELECT * FROM user_doctor_appointment WHERE user_id = ? AND doctor_id = ?`;

  db.query(checkQuery, [user_id, doctor_id], (checkError, checkResults) => {
    if (checkError) {
      console.error(checkError);
      return res.status(500).json({ code: 500, message: "服务器错误" });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({ code: 0, message: "该医生已被预约" });
    }

    // 用户未预约该医生在指定日期的预约，将预约信息插入到user_doctor_appointment表中
    const insertQuery = `INSERT INTO user_doctor_appointment (user_id, doctor_id, appointment_date) VALUES (?, ?, ?)`;

    db.query(
      insertQuery,
      [user_id, doctor_id, appointment_date],
      (insertError, insertResults) => {
        if (insertError) {
          console.error(insertError);
          return res.status(500).json({ code: 0, message: "无法预约医生" });
        }

        // 成功预约医生
        return res.status(200).json({
          code: 200,
          message: "成功预约医生！",
          appointmentDate: appointment_date
        });
      }
    );
  });
};

// 查询用户预约的医生的处理函数
exports.findbookDoctor = (req, res) => {
  const { user_id } = req.body; // 假设从请求体中获取用户ID

  // 查询用户是否有预约医生的记录
  const query = `SELECT doctor_id, appointment_date  FROM user_doctor_appointment WHERE user_id = ?`;

  db.query(query, [user_id], (error, results) => {
    if (error) {
      return res.status(500).json({ code: 500, message: "服务器错误" });
    }

    if (results.length === 0) {
      return res.status(200).json({ code: 0, message: "用户未预约任何医生" });
    }

    const doctorAppointments = results.map((row) => ({
      doctorId: row.doctor_id,
      appointmentDate: row.appointment_date
    }));

    // 根据获取到的医生ID和预约日期查询医生信息
    const getDoctorDetailsQuery = `SELECT * FROM doctor WHERE id IN (?)`;
    const doctorIds = doctorAppointments.map(
      (appointment) => appointment.doctorId
    );

    db.query(getDoctorDetailsQuery, [doctorIds], (error, doctorResults) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ code: 500, message: "无法获取医生详情" });
      }

      if (doctorResults.length === 0) {
        return res.status(200).json({ code: 0, message: "未找到相关医生数据" });
      }

      // 将医生信息和预约日期合并
      const userDoctorAppointments = doctorAppointments.map((appointment) => {
        const doctorDetails = doctorResults.find(
          (doctor) => doctor.id === appointment.doctorId
        );
        return {
          doctor: doctorDetails,
          appointmentDate: appointment.appointmentDate
        };
      });

      return res
        .status(200)
        .json({ code: 200, doctorAppointments: userDoctorAppointments });
    });
  });
};

// 预约家政的处理函数
exports.bookHomeAppointment = (req, res) => {
  const { user_id, clean_id } = req.body;
  // 获取当前时间作为预约时间
  const appointment_date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // 查询用户是否已经预约了特定的家政服务提供商在指定日期的预约
  const checkQuery = `SELECT * FROM user_home_services_appointment WHERE user_id = ? AND clean_id = ?`;

  db.query(checkQuery, [user_id, clean_id], (checkError, checkResults) => {
    if (checkError) {
      console.error(checkError);
      return res.status(500).json({ code: 500, message: "服务器错误" });
    }

    if (checkResults.length > 0) {
      return res
        .status(400)
        .json({ code: 0, message: "该家政服务提供商已被预约" });
    }

    // 用户未预约该家政服务提供商在指定日期的预约，将预约信息插入到user_home_services_appointment表中
    const insertQuery = `INSERT INTO user_home_services_appointment (user_id, clean_id, appointment_date) VALUES (?, ?, ?)`;

    db.query(
      insertQuery,
      [user_id, clean_id, appointment_date],
      (insertError, insertResults) => {
        if (insertError) {
          console.error(insertError);
          return res
            .status(500)
            .json({ code: 0, message: "无法预约家政服务提供商" });
        }

        // 成功预约家政服务提供商
        return res.status(200).json({
          code: 200,
          message: "成功预约家政服务提供商！",
          appointmentDate: appointment_date
        });
      }
    );
  });
};

// 查看自己预约的家政
exports.findbookHome = (req, res) => {
  const { user_id } = req.body; // 假设从请求体中获取用户ID

  // 查询用户是否有预约家政服务的记录
  const query = `SELECT clean_id, appointment_date FROM user_home_services_appointment WHERE user_id = ?`;

  db.query(query, [user_id], (error, results) => {
    if (error) {
      return res.status(500).json({ code: 500, message: "服务器错误" });
    }

    if (results.length === 0) {
      return res
        .status(200)
        .json({ code: 0, message: "用户未预约任何家政服务" });
    }

    const homeServicesAppointments = results.map((row) => ({
      serviceProviderId: row.clean_id,
      appointmentDate: row.appointment_date
    }));

    // 根据获取到的家政服务提供商ID和预约日期查询家政服务提供商信息
    const getServiceProviderDetailsQuery = `SELECT * FROM cleaners WHERE id IN (?)`;
    const serviceProviderIds = homeServicesAppointments.map(
      (appointment) => appointment.serviceProviderId
    );

    db.query(
      getServiceProviderDetailsQuery,
      [serviceProviderIds],
      (error, serviceProviderResults) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ code: 500, message: "无法获取家政服务提供商详情" });
        }

        if (serviceProviderResults.length === 0) {
          return res
            .status(200)
            .json({ code: 0, message: "未找到相关家政服务提供商数据" });
        }

        // 将家政服务提供商信息和预约日期合并
        const userHomeServicesAppointments = homeServicesAppointments.map(
          (appointment) => {
            const serviceProviderDetails = serviceProviderResults.find(
              (provider) => provider.id === appointment.serviceProviderId
            );
            return {
              serviceProvider: serviceProviderDetails,
              appointmentDate: appointment.appointmentDate
            };
          }
        );

        return res.status(200).json({
          code: 200,
          homeServicesAppointments: userHomeServicesAppointments
        });
      }
    );
  });
};

// 编辑用户的信息
exports.editUserInfo = (req, res) => {
  const { id, realName, phoneNumber, age, gender, address, healthStatus } =
    req.body;

  // 检查是否提供了 userId
  if (!id) {
    return res.status(400).json({ code: 400, message: "未提供用户标识" });
  }

  const query = `UPDATE users SET realName = ?, phoneNumber = ?,age = ?, gender = ?, address = ?, healthStatus = ? WHERE id = ?`;

  db.query(
    query,
    [realName, phoneNumber, age, gender, address, healthStatus, id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ code: 500, message: "服务器错误" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ code: 404, message: "用户不存在" });
      }
      return res.status(200).json({ code: 200, message: "用户信息更新成功" });
    }
  );
};

// 根据用户id删除用户
exports.deleteUserById = (req, res) => {
  const userId = req.body.id;

  if (!userId) {
    return res.status(400).json({ code: 400, message: "未提供用户标识" });
  }

  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ code: 500, message: "服务器错误" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "用户不存在" });
    }
    return res.status(200).json({ code: 200, message: "用户删除成功" });
  });
};
