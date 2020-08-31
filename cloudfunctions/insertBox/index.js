// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let def = 1
  // 冰箱码重复
  let box = await db.collection('box').where({
    box_code: event.box_code
  }).get()

  if (box.data.length > 0) {
    return false
  }
  // 查询是否插入的是默认冰箱
  let defResult = await db.collection('user_box').where({
    _openid: event.openid,
    def: 1
  }).get()

  if (defResult.data.length > 0) {
    def = 0
  }

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
      def,
      box_id
    }
  })

  return boxUserInsertResult
}