// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // 当前用户的def重置为0
  await db.collection('user_box').where({
    _openid: event.openid,
    def: 1
  })
  .update({
    data: {
      def: 0
    },
  })
  // 当前的关联关系为默认
  await db.collection('user_box').where({
    _id: event.user_box_id
  })
  .update({
    data: {
      def: 1
    },
  })
}