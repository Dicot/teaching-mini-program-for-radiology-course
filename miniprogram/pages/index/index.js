
//index.js
const app = getApp()
const db = wx.cloud.database();
var hiddenmodalput, hiddendenglu, repetition;
var xueshengzhucema
var jiaoshizhucema
var usershenfen, username, usernumber, userzhucema, usershenfenid, dengluusername, dengluusernumber,dengluusershenfen,iszhuce,importedinfo,zhuceflag,xuanzhongtubiao,hiddenxieyi,sec,content;

Page({
  data: {
    hiddenmodalput: true,
    hiddendenglu: true,
    repetition: true,
    hiddenxieyi:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    usershenfen,
    username,
    usernumber,
    userzhucema,
    openid: '',
    usershenfenid,
    dengluusername,
    dengluusernumber,
    dengluusershenfen,
    iszhuce:false,
    importedinfo:[],
    zhuceflag:false,
    xuanzhongtubiao:true,
    sec:true,
    content:""
  },
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        that.setData({
          openid: openid
        })
      }
    })
  },
  onLoad: function () {
    var that = this
    that.getOpenid();
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection('zhucedengluma').get().then(res => {
      console.log(res.data);
      xueshengzhucema=res.data[0].xueshengzhucema,
      jiaoshizhucema=res.data[0].jiaoshizhucema
      that.data.iszhuce=res.data[0].iszhuce
      console.log(that.data.iszhuce)
  })
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //用户已经授权过
            }
          })
        }
      }
    })
    
  },
  bindGetUserInfo: function (e) {
    var that=this
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      that.weixindenglu()
    } else {
      console.log("jujueshouquan")
    }
  },
  modalinput: function () {
    var that = this;
    that.setData({

      hiddenmodalput: !that.data.hiddenmodalput
    })

  },

  //取消按钮

  cancel: function () {
    var that = this;
    that.setData({

      hiddenmodalput: true

    });

  },

  //确认
  usernameinput: function (e) {
    var that = this;
    that.setData({ username: e.detail.value })
  },
  wenzijiance: function () {
    var that = this
    wx.showToast({
      title: '智能检测中',
      icon: "none",
    })
    that.data.content = that.data.username + that.data.usernumber + that.data.usershenfen + that.data.userzhucema
    wx.cloud.callFunction({
      name: 'msgsec',
      data: {
        text: that.data.content
      }
    }).then((res) => {
      console.log("检测结果", res.result);
      if (res.result.errCode == 0) {
        wx.showToast({
          title: '检测通过',
          icon: "none",
          duration:1000
        })
        console.log("文字正常")
        that.data.sec = true
      } else if (res.result.errCode == 87014) {
        db.collection('minganxinxi').add({
          data: {
            minganxinxi: that.data.content
          }
        })
        wx.showToast({
          icon: 'none',
          title: '文字违规，后台已记录本次操作',
          duration: 1000
        })
        that.data.sec = false
      }
    })
  },


  usernumberinput: function (e) {
    var that = this;
    that.setData({
      usernumber: e.detail.value
    })
  },
  usershenfeninput: function (e) {
    var that = this;
    that.setData({
      usershenfen: e.detail.value
    })
  },
  userzhucemainput: function (e) {
    var that = this;
    that.setData({
      userzhucema: e.detail.value,
    })
  },
  confirm: function () {
    var that = this;
    that.wenzijiance()
    that.setData({
      hiddenmodalput: true,
    })
    if(that.data.sec){
    if (!that.data.username || !that.data.usernumber || !that.data.usershenfen || (that.data.usershenfen != "学生" && that.data.usershenfen != "教师")  || that.data.username.length<2) {
      wx.showToast({
        title: '请检查信息',
        icon: 'none',
        duration: 1000
      })
    }
    else if (!that.data.xuanzhongtubiao){wx.showToast({
      title: '请阅读程序使用协议',
      icon:"none"
    })}
    else if (!((that.data.usershenfen == "学生" && that.data.userzhucema == xueshengzhucema) || (that.data.usershenfen == "教师" && that.data.userzhucema == jiaoshizhucema))) {
      wx.showToast({
        title: '注册码错误',
        icon: 'none',
        duration: 1000,
      })
    }
    else if ((that.data.usershenfen == "学生" && that.data.userzhucema == xueshengzhucema )||( that.data.usershenfen == "教师" && that.data.userzhucema == jiaoshizhucema&&that.data.xuanzhongtubiao)) {
      wx.cloud.init({
        env: 'tyttest-vqzij',
        traceUser: true
      });
      const db = wx.cloud.database();
      //const db = wx.cloud.database(); error

      db.collection('importedinfo').where({ usernumber: that.data.usernumber}).get().then(res => {
        console.log(res.data[0]);
        if(res.data[0]){
          if(res.data[0].username==that.data.username&&res.data[0].usershenfen==that.data.usershenfen){
            console.log("zhucechenggong")
            that.userzhuce()
          }
          else{
            wx.showToast({
              title: '请核对学号及身份',
              icon: "none"
            })
          }
        }
        else{
          wx.showToast({
            title: '未预设用户，请联系管理员',
            icon:"none"
          })
        }
      })
    }}
  },
  userzhuce:function(){
    var that=this
    const db = wx.cloud.database();
    db.collection('userinformation').where({
      usernumber: that.data.usernumber
    }).get().then(res => {
      console.log(res.data);
      if (!res.data[0] && that.data.iszhuce) {
        wx.cloud.callFunction({
          // 云函数名称
          name: 'add',
          // 传给云函数的参数
          data: {
            jihe: "userinformation",
            _openid: that.data.openid,
            username: that.data.username,
            usernumber: that.data.usernumber,
            usershenfen: that.data.usershenfen,
            userzhucema: that.data.userzhucema,
            xieyi: "我已详细阅读并知情同意本程序使用协议",
            myceyan: [],
            myhudong: [],
            mysuitangceyan: [],
            qiandaoriqi: [],
            qiandaotianshu: 0,
            weiduxiaoxi: false,
            weiduindex: -1
          },
          success: function (res) {
            console.log("更新成功", res)
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res);
            console.log(res.errMsg);
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 1000,
            })
            that.data.zhuceflag = false
          },
          fail: console.error
        })
      }
      else if (res.data[0]) {
        console.log("重复注册");
        wx.showToast({
          title: '请勿重复注册',
          icon: "none",
          duration: 1000,
        })
      }
      else {
        wx.showToast({
          title: '注册失败',
          icon: "none"
        })
      }
    })
  },
  //denglufunction
  denglumodal: function () {
    var that = this;
    that.setData({
      hiddendenglu: !that.data.hiddendenglu
    })

  },

  //取消按钮

  denglucancel: function () {
    var that = this;
    that.setData({

      hiddendenglu: true

    });

  },

  //确认
  dengluusernameinput: function (e) {
    var that = this;
    that.setData({ dengluusername: e.detail.value })
  },
  dengluusernumberinput: function (e) {
    var that = this;
    that.setData({ dengluusernumber: e.detail.value })
  },
  dengluconfirm: function () {
    var that = this;
    that.setData({
      hiddendenglu: true,
    })
    if (that.data.dengluusername !== 0 && that.data.dengluusernumber !==0) {
      wx.cloud.init({
        env: 'tyttest-vqzij',
        traceUser: true
      });
      // 初始化数据库
      const db = wx.cloud.database();
      db.collection('userinformation').where({
        username: that.data.dengluusername
      }).get().then(res => {
        //console.log(res.data[0]._openid)
        if (!res.data[0]) {
          wx.showToast({
            title: '用户未激活',
            icon: 'none',
            duration: 1000
          })
        }
        else if (res.data[0].usernumber == that.data.dengluusernumber && (res.data[0]._openid==that.data.openid||!res.data[0]._openid)) {
          console.log("登录成功"); 
          app.globalData.username=res.data[0].username;
          app.globalData.usernumber = res.data[0].usernumber;
          app.globalData.usershenfen = res.data[0].usershenfen;
          app.globalData.usershenfenid = res.data[0]._id;
          console.log(app.globalData.usershenfenid)
          wx.navigateTo({
            url: '../../pages/loginsuccess/loginsuccess',
          })

        }
        else {
          wx.showToast({
            title: '请检查信息',
            icon:'none',
            duration: 1000,
          })
        }
      })
    }
  },
  weixindenglu: function () {
    var that = this;
      wx.cloud.init({
        env: 'tyttest-vqzij',
        traceUser: true
      });
      // 初始化数据库
      const db = wx.cloud.database();
      db.collection('userinformation').where({
        _openid: that.data.openid
      }).get().then(res => {
        //console.log(res.data[0]._openid)
        if (!res.data[0]) {
          wx.showToast({
            title: '请先激活账户',
            icon: 'none',
            duration: 1000
          })
        }
        else if (res.data[0]) {
          console.log("登录成功");
          app.globalData.username = res.data[0].username;
          app.globalData.usernumber = res.data[0].usernumber;
          app.globalData.usershenfen = res.data[0].usershenfen;
          app.globalData.usershenfenid = res.data[0]._id;
          console.log(app.globalData.usershenfenid)
          wx.navigateTo({
            url: '../../pages/loginsuccess/loginsuccess',
          })
        }
        else{
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 1000,
          })
        }
      })
  },




  /**
   * 判断用户是否登录
   */
  jugdeUserLogin: function (event) {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.data.user = res.userInfo;
              console.log(that.data.user)
            }
          })
        }
      }
    })
  },
ontapxieyi:function(){
  var that = this;
  that.setData({
   hiddenmodalput:true,
  });
  wx.navigateTo({
    url: '../../pages/xieyi/xieyi',
  })
},
/*ontaptongyixieyi:function(){
  var that=this
  if(that.data.xuanzhongtubiao==false){
  that.setData({
    xuanzhongtubiao:true
  })}
  else if(that.data.xuanzhongtubiao){
    that.setData({
      xuanzhongtubiao:false
    })
  }
}*/














})