// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('user_box').where({
    def: 1
  })
  .update({
    data: {
      def: 0
    },
  })
  await db.collection('user_box').where({
    _id: event.user_box_id
  })
  .update({
    data: {
      def: 1
    },
  })
}