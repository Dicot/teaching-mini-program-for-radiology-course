// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  env: 'tyttest-vqzij'
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  try {
    return await db.collection(event.jihe).doc(event.id).remove({
      success(res) {

      }
    })
  } catch (e) {
    console.error(e)
  }
}
 