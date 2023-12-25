// 引入Joi模块
const joi = require("joi");

//定义分类名字和别名的校验规则
const username = joi.string().required();
const price = joi.string().required();
const workTime = joi.string().required();
const avatar = joi.string().optional();

//定义id的校验规则
const id = joi.number().integer().min(1).required();

exports.VerifyCleaners = {
  body: {
    username,
    price,
    workTime
  }
};

exports.VerifyUpdateCleaners = {
  body: {
    id,
    username,
    price,
    workTime,
    avatar
  }
};

exports.VerifyDeleteCleaners = {
  body: {
    id
  }
};
