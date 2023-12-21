// 引入Joi模块
const joi = require("joi");

//定义用户名和密码的校验规则
// 定义一个函数，用于验证用户名
const username = joi.string().alphanum().min(3).max(10).required();
const password = joi
  // 声明一个字符串类型的变量
  .string()
  // 设置字符串的长度在3-12之间
  .pattern(/^[\S]{3,12}$/)
  // 设置字符串是必须的
  .required();

const phone = joi
  .string()
  .regex(/^[1][3,4,5,7,8][0-9]{9}$/)
  .required();

// 定义修改用户信息的验证规则
const id = joi.number().integer().min(1).required();

//定义验证头像的规则信息(不是必须)
const avatar = joi.string().uri().required();

//定义验证注册和登录表单数据的规则和对象
exports.VerifyRegister = {
  body: {
    username,
    password,
    phone
  }
};

exports.VerifyLogin = {
  username,
  password
};

exports.VerifyUpdate = {
  id,
  username,
  phone
};

exports.VerifyPwd = {
  //新旧密码不能一致且都需要遵循验证规则
  body: {
    oldPassword: password,
    newPassword: joi.not(joi.ref("oldPassword")).concat(password)
  }
};
