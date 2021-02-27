// 云函数入口文件 index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'tyttest-vqzij'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: event.text
    })
    return result
  } catch (err) {
    return err
  }

}