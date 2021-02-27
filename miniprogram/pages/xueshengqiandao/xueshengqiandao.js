const app = getApp()
var util = require('../../modules/utils.js');
var userqiandaoma, qiandaoma, time, usershenfenid, qiandaotianshu, qiandaoriqi = [], riqi = [], isqiandao, qiandaostuinfo, stuinfo, qiandaorenshu, zhou, dangqianzhou, tijiaoflag, qiandaodisabled;
var username, usernumber;
Page({
  data: {
    userqiandaoma,
    qiandaoma,
    time,
    qiandaodisabled,
    usershenfenid,
    riqi,
    qiandaoriqi,
    qiandaotianshu,
    isqiandao,
    qiandaostuinfo: [],
    stuinfo,
    qiandaorenshu,
    username, usernumber,
    qiandaoid: "",
    zhou,
    tijiaoflag:true,
    dangqianzhou,
  },

  onLoad: function () {
    var that = this
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    that.setData({
      username: app.globalData.username,
      usernumber: app.globalData.usernumber,
      time: time,
      usershenfenid: app.globalData.usershenfenid
    });

    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection('zhucedengluma').get({
      //如果查询成功的话    
      success: function (res) {
        that.setData({
          qiandaoma: res.data[0].qiandaoma,
          isqiandao: res.data[0].isqiandao,
          dangqianzhou:res.data[0].dangqianzhou
        }),
          console.log(that.data.time);
      }
    });
    db.collection('userinformation').where({
      _id: that.data.usershenfenid
    }).get().then(res => {
      console.log(res.data)
      if (!res.data[0].qiandaoriqi) { res.data[0].qiandaoriqi = [] }
      if (!res.data[0].qiandaotianshu) { res.data[0].qiandaotianshu = 0 }
      that.setData({
        qiandaoriqi: res.data[0].qiandaoriqi,
        qiandaotianshu: res.data[0].qiandaotianshu
      })
      console.log(that.data.qiandaotianshu);
      console.log(that.data.qiandaoriqi);
    });
    console.log(time, that.data.time)
  },
  qiandaomainput: function (e) {
    var that = this;
    that.setData({
      userqiandaoma: e.detail.value
    })
  },
ontapqiandao:function(){
  var that=this
  if(that.data.tijiaoflag){
    that.ontapqiandaodelay()
  }
  that.setData({
    qiandaodisabled:true
  })
  that.data.tijiaoflag=false
},


  ontapqiandaodelay: function () {
    var that = this
    if (that.data.isqiandao){
      console.log(that.data.dangqianzhou,that.data.usernumber)
      wx.cloud.callFunction({
        // 云函数名称
        name: 'dataexist',
        // 传给云函数的参数
        data: {
          jihe:that.data.dangqianzhou,
          chaxundata:that.data.usernumber
        },
        success: function (res) {
          console.log("获取成功", res)
         if(res.result.data.length==0){
           if (that.data.userqiandaoma == that.data.qiandaoma) {

             wx.cloud.init({
               env: 'tyttest-vqzij',
               traceUser: true
             });
             // 初始化数据库
             const db = wx.cloud.database();
             db.collection('zhucedengluma').get({
               //如果查询成功的话    
               success: function (res) {  
                 if (res.data[0].diyizhouqiandao.indexOf(that.data.userqiandaoma) > -1) {
                   that.data.zhou = "diyizhou"
                   console.log(that.data.zhou)
                   wx.cloud.init({
                     env: 'tyttest-vqzij',
                     traceUser: true
                   });
                   // 初始化数据库
                   const db = wx.cloud.database();
                   db.collection('diyizhouqiandao').add({
                     data: {
                       qiandaoma: that.data.userqiandaoma,
                       username: that.data.username,
                       usernumber: that.data.usernumber,
                     },
                     success: function (res) {
                       that.data.qiandaotianshu = that.data.qiandaotianshu + 1
                       that.data.qiandaoriqi.push(that.data.userqiandaoma)
                       wx.cloud.callFunction({
                         // 云函数名称
                         name: 'update',
                         // 传给云函数的参数
                         data: {
                           jihe: "userinformation",
                           id: that.data.usershenfenid,
                           mingcheng: 'qiandaoriqi',
                           qiandaoriqi: that.data.qiandaoriqi,
                           qiandaotianshu: that.data.qiandaotianshu
                         },
                         success: function (res) {
                           console.log("更新成功", res)
                           wx.showToast({
                             title: '签到成功',
                             icon: "success"
                           })
                           wx.redirectTo({
                             url: '/pages/xueshengjiaoxuejiemian/xueshengjiaoxuejiemian',
                           })
                         },
                         fail: console.error
                       })






                     }
                   })
                 }
                 if (res.data[0].dierzhouqiandao.indexOf(that.data.userqiandaoma) > -1) {
                   that.data.zhou = "dierzhou"
                   console.log(that.data.zhou)
                   wx.cloud.init({
                     env: 'tyttest-vqzij',
                     traceUser: true
                   });
                   // 初始化数据库
                   const db = wx.cloud.database();
                   db.collection('dierzhouqiandao').add({
                     data: {
                       qiandaoma: that.data.userqiandaoma,
                       username: that.data.username,
                       usernumber: that.data.usernumber,
                     },
                     success: function (res) {
                       that.data.qiandaotianshu = that.data.qiandaotianshu + 1
                       that.data.qiandaoriqi.push(that.data.userqiandaoma)
                       wx.cloud.callFunction({
                         // 云函数名称
                         name: 'update',
                         // 传给云函数的参数
                         data: {
                           jihe: "userinformation",
                           id: that.data.usershenfenid,
                           mingcheng: 'qiandaoriqi',
                           qiandaoriqi: that.data.qiandaoriqi,
                           qiandaotianshu: that.data.qiandaotianshu
                         },
                         success: function (res) {
                           console.log("更新成功", res)
                           wx.showToast({
                             title: '签到成功',
                             icon: "success"
                           })
                           wx.redirectTo({
                             url: '/pages/xueshengjiaoxuejiemian/xueshengjiaoxuejiemian',
                           })
                         },
                         fail: console.error
                       })

                     }
                   })
                 }
                 if (res.data[0].disanzhouqiandao.indexOf(that.data.userqiandaoma) > -1) {
                   that.data.zhou = "disanzhou"
                   console.log(that.data.zhou)
                   wx.cloud.init({
                     env: 'tyttest-vqzij',
                     traceUser: true
                   });
                   // 初始化数据库
                   const db = wx.cloud.database();
                   db.collection('disanzhouqiandao').add({
                     data: {
                       qiandaoma: that.data.userqiandaoma,
                       username: that.data.username,
                       usernumber: that.data.usernumber,
                     },
                     success: function (res) {
                       that.data.qiandaotianshu = that.data.qiandaotianshu + 1
                       that.data.qiandaoriqi.push(that.data.userqiandaoma)
                       wx.cloud.callFunction({
                         // 云函数名称
                         name: 'update',
                         // 传给云函数的参数
                         data: {
                           jihe: "userinformation",
                           id: that.data.usershenfenid,
                           mingcheng: 'qiandaoriqi',
                           qiandaoriqi: that.data.qiandaoriqi,
                           qiandaotianshu: that.data.qiandaotianshu
                         },
                         success: function (res) {
                           console.log("更新成功", res)
                           wx.showToast({
                             title: '签到成功',
                             icon: "success"
                           })
                           wx.redirectTo({
                             url: '/pages/xueshengjiaoxuejiemian/xueshengjiaoxuejiemian',
                           })
                         },
                         fail: console.error
                       })

                     }
                   })
                 }
                 if (res.data[0].disizhouqiandao.indexOf(that.data.userqiandaoma) > -1) {
                   that.data.zhou = "disizhou"
                   console.log(that.data.zhou)
                   wx.cloud.init({
                     env: 'tyttest-vqzij',
                     traceUser: true
                   });
                   // 初始化数据库
                   const db = wx.cloud.database();
                   db.collection('disizhouqiandao').add({
                     data: {
                       qiandaoma: that.data.userqiandaoma,
                       username: that.data.username,
                       usernumber: that.data.usernumber,
                     },
                     success: function (res) {
                       that.data.qiandaotianshu = that.data.qiandaotianshu + 1
                       that.data.qiandaoriqi.push(that.data.userqiandaoma)
                       wx.cloud.callFunction({
                         // 云函数名称
                         name: 'update',
                         // 传给云函数的参数
                         data: {
                           jihe: "userinformation",
                           id: that.data.usershenfenid,
                           mingcheng: 'qiandaoriqi',
                           qiandaoriqi: that.data.qiandaoriqi,
                           qiandaotianshu: that.data.qiandaotianshu
                         },
                         success: function (res) {
                           console.log("更新成功", res)
                           wx.showToast({
                             title: '签到成功',
                             icon: "success"
                           })
                           wx.redirectTo({
                             url: '/pages/xueshengjiaoxuejiemian/xueshengjiaoxuejiemian',
                           })
                         },
                         fail: console.error
                       })
                     }
                   })
                 }



               }
             })
           }
             else {
             wx.showToast({
               title: '签到码错误',
               icon: "none"
             })
           }
         }
         else{wx.showToast({
           title: '已签到成功',
           icon: "none"
         })}
        },
        fail: console.error
      })

    }
    else{wx.showToast({
      title: '签到尚未开始',
      icon: "none"
    })}
  },


   

})
