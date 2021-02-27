const cloud = require('wx-server-sdk')
const rq = require('request-promise')
const APPID = 'wx222e522a52b1af76';
const APPSECRET = 'f8bbfc77da14053f7fedaed55ae9d97b';
const COLLNAME = 'accesstoken';
const FIELDNAME = 'a36df34b-7632-4a05-b300-a16a1aad9b3f'

cloud.init({
  env: 'tyttest-vqzij'
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    let res = await rq({
      method: 'GET',
      uri: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET,
    });
    res = JSON.parse(res)

    let resUpdate = await db.collection(COLLNAME).doc(FIELDNAME).update({
      data: {
        token: res.access_token
      }
    })
  } catch (e) {
    console.error(e)
  }
}