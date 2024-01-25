// 引入Joi模块
const joi = require("joi");

//定义分类名字和别名的校验规则
const username = joi.string().required();
const treatmentTime = joi.string().required();
const affiliatedHospital = joi.string().required();
const price = joi.string().required();
//定义id的校验规则
const id = joi.number().integer().min(1).required();
const avatar = joi.string().required();

//校验规则
exports.VerifyDoctor = {
  body: {
    username,
    price,
    treatmentTime,
    affiliatedHospital,
    avatar
  }
};

// 修改医生的验证规则
exports.VerifyChangeDoctor = {
  body: {
    id,
    username,
    price,
    treatmentTime,
    affiliatedHospital
  }
};

//删除医生的验证规则
exports.VerifyDeleteDoctor = {
  body: {
    id
  }
};
