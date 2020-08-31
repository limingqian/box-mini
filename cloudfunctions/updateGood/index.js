// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('good').where({
      _id: event._id
    })
    .update({
      data: {
        alert_date: event.alert_date,
        fileID: event.fileID,
        in_stock: event.in_stock,
        name: event.name,
        remark: event.remark,
        save_date: event.save_date,
        type_id: event.type_id
      }
    })
  return true
}