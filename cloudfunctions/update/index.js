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

    if(event.mingcheng=="isceyan")
    return await db.collection(event.jihe).doc(event.id).update({
        data: {
          isceyan: event.neirong
        }
      })  
    if (event.mingcheng == "isceyantimu")
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          isceyan: event.isceyan,
          cuotiflag: event.cuotiflag
        }
      }) 

    if (event.mingcheng == 'myhudong') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          myhudong: event.myhudong
        }
      })
    } 
    if (event.mingcheng == 'mysuitangceyan') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          mysuitangceyan: event.mysuitangceyan
        }
      })
    } 
    if (event.mingcheng == 'qiandaoriqi') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          qiandaoriqi: event.qiandaoriqi,
          qiandaotianshu:event.qiandaotianshu
        }
      })
    } 
    if (event.mingcheng == 'weiduxiaoxi') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          weiduxiaoxi: event.weiduxiaoxi,
          weiduindex: event.weiduindex
        }
      })
    } 
    if (event.mingcheng == 'myceyan') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          myceyan: event.myceyan
        }
      })
    } 
    if (event.mingcheng == 'myhudongreply') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          myhudong: event.myhudong,
          weiduxiaoxi: event.weiduxiaoxi,
          weiduindex: event.weiduindex
        }
      })
    }
    if (event.mingcheng == 'reply') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          reply_name: event.reply_name,
          reply_time: event.reply_time,
          reply_miaosu: event.reply_miaosu
        }
      })
    }
    if (event.mingcheng == 'isqiandao') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          isqiandao: event.isqiandao
        }
      })
    }
    if (event.mingcheng == 'tongzhi') {
        return await db.collection(event.jihe).doc(event.id).update({
          data: {
            photopath: event.photopath,
            biaoti: event.biaoti,
            neirong: event.neirong,
          }
        })
    }
    if (event.mingcheng == 'tongzhi1') {

      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          biaoti: event.biaoti,
          neirong: event.neirong,
        }
      })
    }
    if (event.mingcheng == 'diyizhouyuxi') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          diyizhouyuxi: event.neirong
        }
      })
    }
    if (event.mingcheng == 'dierzhouyuxi') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          dierzhouyuxi: event.neirong
        }
      })
    }
    if (event.mingcheng == 'disanzhouyuxi') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          disanzhouyuxi: event.neirong
        }
      })
    }
    if (event.mingcheng == 'disizhouyuxi') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
           disizhouyuxi: event.neirong
        }
      })
    }
    if (event.mingcheng == 'diyizhouqiandao') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          diyizhouqiandao: event.diyizhouqiandao,
          qiandaoma: event.qiandaoma,
          dangqianzhou:event.dangqianzhou,
        }
      })
    }
    if (event.mingcheng == 'dierzhouqiandao') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          dierzhouqiandao: event.dierzhouqiandao,
          qiandaoma: event.qiandaoma,
          dangqianzhou: event.dangqianzhou,
        }
      })
    }
    if (event.mingcheng == 'disanzhouqiandao') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          disanzhouqiandao: event.disanzhouqiandao,
          qiandaoma: event.qiandaoma,
          dangqianzhou: event.dangqianzhou,
        }
      })
    }
    if (event.mingcheng == 'disizhouqiandao') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          disizhouqiandao: event.disizhouqiandao,
          qiandaoma: event.qiandaoma,
          dangqianzhou: event.dangqianzhou,
        }
      })
    }
    if (event.mingcheng == 'hudongshanchu') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          myhudong: event.myhudong
        }
      })
    }
    if (event.mingcheng == 'yingxiangziliao') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          photopath: event.photopath
        }
      })
    }
    if (event.mingcheng == 'bingliyincang') {
      return await db.collection(event.jihe).doc(event.id).update({
        data: {
          binglihidden: event.binglihidden
        }
      })
    }
   



  } catch (e) {
    console.error(e)
  }
}

