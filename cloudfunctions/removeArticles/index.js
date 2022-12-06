// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command;

const articles = db.collection('articles');

exports.main = async (event, context) => await articles
    .where({
        _id: event.id
    })
    .remove()