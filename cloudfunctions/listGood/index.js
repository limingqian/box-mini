// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('+++++++++++');
  console.log(event.box_id);
  console.log('+++++++++++');
  let promiseArray = []
  promiseArray.push(db.collection('type').get())
  promiseArray.push(db.collection('good').where({
      box_id: event.box_id
    })
    .get())
  let result = await Promise.all(promiseArray)

  // 构造分类列表
  let typeArray = result[0].data
  let list = result[1].data
  return {
    typeArray,
    list
  }
}