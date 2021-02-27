// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'tyttest-vqzij'
})
const db = cloud.database()
// 云函数入口函数

exports.main = async (event, context) => {
  console.log(event.jihe)
  try {
  
    return await db.collection(event.jihe).where({
      //下面这3行，为筛选条件
        usernumber:event.chaxundata
    }).get({
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}
