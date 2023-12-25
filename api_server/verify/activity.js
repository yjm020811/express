// 引入Joi模块
const joi = require("joi");

const activityName = joi.string().min(2).max(10).required();
const activityDesc = joi.string().min(2).max(100).required();
const address = joi.string().required();

// 定义时间的验证规则
const activityStartTime = joi.date().required();

//定义id的校验规则
const id = joi.number().integer().min(1).required();

//新增活动的验证规则
exports.VerifyActivity = {
  body: {
    activityName,
    activityDesc,
    address,
    activityStartTime
  }
};
// 修改活动的验证规则
exports.VerifyChangeActivity = {
  body: {
    id,
    activityName: joi.string().min(2).max(10).optional(),
    activityDesc: joi.string().min(2).max(100).optional(),
    address: joi.string().optional(),
    activityStartTime: joi.date().optional()
  }
};

// 删除活动的验证规则
exports.VerifyDeleteActivity = {
  body: {
    id
  }
};
