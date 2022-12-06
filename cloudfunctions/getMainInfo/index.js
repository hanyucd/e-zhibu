// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

const main_info = db.collection('main_info');

// 云函数入口函数
exports.main = async (event, context) => {
  return await main_info.where({
      _id: 'W-Z0M6u9e31Z7LEg' // 填入当前用户 openid
    }).get();
}