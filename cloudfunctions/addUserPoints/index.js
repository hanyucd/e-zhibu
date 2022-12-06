// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command

const users = db.collection('users');

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.video_id){
      return await users.where({
        _id: event.id
      })
        .update({
          data: {
            points: _.inc(1),
            video_list: _.push(event.video_id)
          },
        })
    }else{
      return await users.where({
        _id: event.id
      })
        .update({
          data: {
            points: _.inc(1)
          },
        })
    }
  } catch (e) {
    console.error(e)
  }

}