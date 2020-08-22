// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let boxInsertResult = await db.collection('box').add({
    data: {
      name: event.box_name,
      box_code: event.box_code,
      box_des: event.box_des
    }
  })
  let box_id = boxInsertResult._id
  let boxUserInsertResult = await db.collection('user_box').add({
    data: {
      _openid: event.openid,
      box_id
    }
  })

  return boxUserInsertResult
}