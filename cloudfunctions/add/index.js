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
      return await db.collection(event.jihe).add({
        data: {
          username: event.username,
          usernumber: event.usernumber,
          usershenfen: event.usershenfen,
          userzhucema: event.userzhucema,
         // usernickname: event.usernickname,
          xieyi: event.xieyi,
          _openid: event._openid,
          myceyan: event.myceyan,
          myhudong: event.myhudong,
          mysuitangceyan: event.mysuitangceyan,
          qiandaoriqi: event.qiandaoriqi,
          qiandaotianshu: event.qiandaotianshu,
          weiduxiaoxi: event.weiduxiaoxi,
          weiduindex: event.weiduindex
        }
      })
  } catch (e) {
    console.error(e)
  }
}

