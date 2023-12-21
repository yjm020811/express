// 引入Joi模块
const joi = require("joi");

//定义分类名字和别名的校验规则
const username = joi.string().required();
const treatmentTime = joi.string().required();
const affiliatedHospital = joi.string().required();
const avatar = joi.string().required();
//定义id的校验规则
const id = joi.number().integer().min(1).required();

//校验规则
exports.VerifyDoctor = {
  body: {
    username,
    treatmentTime,
    avatar,
    affiliatedHospital
  }
};

// 修改医生的验证规则
exports.VerifyChangeDoctor = {
  body:{
    id,
    username,
    treatmentTime,
    avatar,
    affiliatedHospital
  }
}

//删除医生的验证规则
exports.VerifyDeleteDoctor = {
  body:{
    id
  }
}


