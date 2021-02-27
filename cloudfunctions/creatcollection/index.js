const cloud = require('wx-server-sdk')
cloud.init({
  env: 'tyttest-vqzij'
})
const db = cloud.database()
exports.main = async (event, context) => {
  return await db.createCollection(event.mingcheng)
}

