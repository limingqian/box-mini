// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
var $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  // 组合 mergeObjects 应用相等匹配
  return await db.collection('user_box').aggregate()
  .match({
    _openid: event.openid
  })
  .lookup({
    from: 'box',
    localField: 'box_id',
    foreignField: '_id',
    as: 'box_list',
  })
  .replaceRoot({
    newRoot: $.mergeObjects([ $.arrayElemAt(['$box_list', 0]), '$$ROOT' ])
  })
  .project({
    box_list: 0
  })
  .end()
}