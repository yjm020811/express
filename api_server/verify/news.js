// 引入Joi模块
const joi = require("joi");

//定义分类名字和别名的校验规则
const newsName = joi.string().required();
const newsContent = joi.string().required();
const img = joi.string().required();
const releaseTime = joi.date().required();

//定义id的校验规则
const id = joi.number().integer().min(1).required();

exports.VerifyNews = {
  body: {
    newsName,
    newsContent,
    img
  }
};

exports.VerifyUpdateNews = {
  body: {
    id,
    newsName,
    newsContent,
    img,
    releaseTime
  }
};

exports.VerifyDeleteNews = {
  body: {
    id
  }
};
