// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command;

const w_apply_list = db.collection('w_apply_list');

exports.main = async (event, context) => await w_apply_list
  .where({
    type: _.or(_.eq("0"), _.eq("1")) //暂不考虑积分申请里的类型,仅考虑E网青声中的思想汇报与活动心得
  })
  .field({
    content: true,
    imgs: true,
    type: true,
    user_id: true,
    username: true,
    uploadDate: true
  })
  .skip(event.skip)
  .limit(20)
  .get()