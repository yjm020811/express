const joi = require("joi");
const userId = joi.number().integer().min(1);
const activityId = joi.number().integer().min(1);

//参加活动的验证规则
exports.VerifyJoinActivity = {
  body: {
    userId,
    activityId
  }
};
