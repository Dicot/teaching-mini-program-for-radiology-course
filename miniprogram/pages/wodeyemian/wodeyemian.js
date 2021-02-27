const app=getApp();
var username, usershenfen, usershenfenid, time,keyword,hudong=[{}],qiandaotianshu,key,myhudong;
var index, hudongid, question, mysuitangceyan, mycuotiji, weiduindex, weiduxiaoxi;
Page({
  data: {
    username,
    usershenfen,
    usershenfenid,
    qiandaoriqi:[{}],
    myceyan:[{}],
    myhudong:[{}],
    photopath: [],
    ceyanflag: [],
    hudongflag: [],
    suitangceyanflag:[],
    time,
    keyword,
    index,
    hudongid:"",
    qiandaotianshu,
    question:[],
    mysuitangceyan,
    mycuotiji,
    weiduxiaoxi,
    weiduindex,
    cuotiflag:[],
  },
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.username, app.globalData.usershenfen)
    that.setData({ username: app.globalData.username })
    that.setData({ usershenfen: app.globalData.usershenfen })
    that.setData({ usershenfenid: app.globalData.usershenfenid })
    //var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    /*this.setData({
      time: time
    });*/
    that.setData({
      keyword: options.keyword
    })
    var that = this;
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    const db = wx.cloud.database();
    db.collection("userinformation").where({
      _id: that.data.usershenfenid
    }).get({
      //如果查询成功的话    
      success: function (res) {
        if (!res.data[0].qiandaoriqi) { res.data[0].qiandaoriqi = [] }
        if (!res.data[0].myceyan) { res.data[0].myceyan = [] }
        if (!res.data[0].myhudong) { res.data[0].myhudong = [] }
        if (!res.data[0].qiandaotianshu) { res.data[0].qiandaotianshu = 0 }
        if (!res.data[0].mysuitangceyan) { res.data[0].mysuitangceyan = [] }
        that.setData({
          qiandaoriqi: res.data[0].qiandaoriqi,
          qiandaotianshu: res.data[0].qiandaotianshu,
          myceyan: res.data[0].myceyan,
          myhudong: res.data[0].myhudong,
          mysuitangceyan: res.data[0].mysuitangceyan
        })

        //console.log(res.data[0])
        that.data.weiduindex=res.data[0].weiduindex
        that.data.weiduxiaoxi=res.data[0].weiduxiaoxi
        console.log(that.data.weiduxiaoxi,that.data.weiduindex)
        if (res.data[0].weiduxiaoxi) {
          var tempflag = that.data.hudongflag[res.data[0].weiduindex]
          console.log(res.data[0].weiduindex)
          that.data.hudongflag[res.data[0].weiduindex] = true;
          that.setData({ hudongflag: that.data.hudongflag })
        }
      }
    });


   // const db = wx.cloud.database();
    setTimeout(function(){

      wx.cloud.callFunction({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          jihe: "userinformation",
          id: that.data.usershenfenid,
          mingcheng: 'weiduxiaoxi',
          weiduxiaoxi: false, 
          weiduindex: -1
        },
        success: function (res) {
          console.log("更新成功", res)
        },
        fail: console.error
      })
    },1000)
    
   
  }, 
  onShow:function(){
    var that=this
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    const db = wx.cloud.database();
    db.collection("ceyantimu").where({
      zhou:"diyizhou"
    }).get({
      success: function (res) {
     if(res.data[0]){
       that.data.cuotiflag[0]=res.data[0].cuotiflag
       that.setData({
         cuotiflag: that.data.cuotiflag
       })
     }
      }
    })
    db.collection("ceyantimu").where({
      zhou: "dierzhou"
    }).get({
      success: function (res) {
        if (res.data[0]) {
          that.data.cuotiflag[1] = res.data[0].cuotiflag
          that.setData({
            cuotiflag: that.data.cuotiflag
          })
        }
      }
    })
    db.collection("ceyantimu").where({
      zhou: "disanzhou"
    }).get({
      success: function (res) {
        if (res.data[0]) {
          that.data.cuotiflag[2] = res.data[0].cuotiflag
          that.setData({
            cuotiflag: that.data.cuotiflag
          })
        } 
      }
    })
    db.collection("ceyantimu").where({
      zhou: "disizhou"
    }).get({
      success: function (res) {
        if (res.data[0]) {
          that.data.cuotiflag[3] = res.data[0].cuotiflag
          that.setData({
            cuotiflag: that.data.cuotiflag
          })
        } 
      }
    })




  },





  hudongshanchu:function(e){
    var that=this
    wx.showToast({
      title: '请稍候',
      icon:"none",
      duration:1000
    })
    var index = e.currentTarget.dataset.index;
    var hudongremoved=that.data.myhudong.splice(index,1)
    console.log(hudongremoved)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update',
      // 传给云函数的参数
      data: {
        jihe: "userinformation",
        id: that.data.usershenfenid,
        mingcheng: 'hudongshanchu',
        myhudong: that.data.myhudong
      },
      success: function (res) {
        console.log("更新成功", res)
      },
      fail: console.error
    })
    const db = wx.cloud.database();
    // console.log(hudongremoved[0].hudongid)
    if (hudongremoved[0].hudongid) {
      db.collection('hudong').doc(hudongremoved[0].hudongid).remove({
        success(res) {
          wx.redirectTo({
            url: '../../pages/gerenxinxi/gerenxinxi',
          })
        },
        fail(res){
          console.log("yishanchu")
          wx.redirectTo({
            url: '../../pages/gerenxinxi/gerenxinxi',
          })
        }
      })
    }

  },
  changeceyanflag: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.ceyanflag[index]) {
      this.data.ceyanflag[index] = false;
    } else {
      this.data.ceyanflag[index] = true;
    }
    this.setData({
      ceyanflag: this.data.ceyanflag
    })
  },
  changesuitangceyanflag: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.suitangceyanflag[index]) {
      this.data.suitangceyanflag[index] = false;
    } else {
      this.data.suitangceyanflag[index] = true;
    }
    this.setData({
      suitangceyanflag: this.data.suitangceyanflag
    })
  },
  changehudongflag: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.hudongflag[index]) {
      this.data.hudongflag[index] = false;
    } else {
      this.data.hudongflag[index] = true;
    }
    this.setData({
      hudongflag: this.data.hudongflag
    })
  },
  previewimg: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    console.log(url)
    wx.previewImage({
      current: url[0], // 当前显示图片的http链接
      urls: url
    })
  },


}) 