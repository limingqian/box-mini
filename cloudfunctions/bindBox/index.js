// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let box = await db.collection('box').where({
    box_code: event.box_id
  }).get()
  if (box.data.length > 0) {
    // 如果没有默认冰箱则当前为默认
    let sameBox = await db.collection('user_box').where({
      _openid: event.openid,
      box_id: box.data[0]._id
    }).get({})
    if (sameBox.data.length > 0) {
      return false
    }
    let userBox = await db.collection('user_box').where({
      _openid: event.openid,
      def: 1
    }).get({})

    await db.collection('user_box').add({
      data: {
        _openid: event.openid,
        box_id: box.data[0]._id,
        def: !userBox.data.length ? 1 : 0
      }
    })
    return box.data[0]._id
  } else {
    return false
  }
}