
 const app = getApp()
var usershenfen;
var username;
Page({
  data: {
     username,  
     usershenfen,
    tongzhikey: ["zhujiemiantongzhi1", "zhujiemiantongzhi2","zhujiemiantongzhi3"],
    tongzhi0:{},
    tongzhi1:{},
    tongzhi2:{},
    tongzhihidden:true,
    photopath:[],
    title:"",
    neirong:"",
    animationData: {}, //内容动画
    animationMask: {}, //蒙板动画
    jianjiehidden:true,
  },
  onLoad:function(){
   var that =this;
    //console.log(app.globalData.username, app.globalData.usershenfen)
    that.setData({username: app.globalData.username})
    that.setData({ usershenfen: app.globalData.usershenfen })
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection('tongzhi').where({
      tongzhikey: that.data.tongzhikey[0]
    }).get().then(res => {
      that.setData({tongzhi0:res.data[0]})
    })
    db.collection('tongzhi').where({
      tongzhikey: that.data.tongzhikey[1]
    }).get().then(res => {
      that.setData({ tongzhi1: res.data[0] })
    })
    db.collection('tongzhi').where({
      tongzhikey: that.data.tongzhikey[2]
    }).get().then(res => {
      that.setData({ tongzhi2: res.data[0] })
    })
    that.animateTrans = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })

    that.animateFade = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
  },
  onShow: function () {
    app.editTabBar();    //显示自定义的底部导航
  },
  ontapziliao:function(){
    wx.navigateTo({
      url: '/pages/yingxiangziliao1/yingxiangziliao1',
    })
  }, 
  ontapdianxingbingli: function () {
    if (this.data.usershenfen == "学生") {
      console.log(0)
      wx.navigateTo({
        url: '/pages/dianxingbinglixuesheng/dianxingbinglixuesheng',
      })
    }
    else if (this.data.usershenfen == "教师") {
      wx.navigateTo({
        url: '/pages/dianxingbingli/dianxingbingli',
      })
    }
  },
  ontapjiaoxuerukou:function(){
    console.log(1)
    if(this.data.usershenfen=="学生"){
      console.log(0)
      wx.navigateTo({

        url: '/pages/xueshengjiaoxuejiemian/xueshengjiaoxuejiemian',
      })
    }
    else if(this.data.usershenfen=="教师"){
      wx.navigateTo({
        url: '/pages/jiaoshijiaoxuejiemian/jiaoshijiaoxuejiemian',
      })
    }
  },
  tongzhixiangqing:function(e){
    var that=this;
   var index = e.currentTarget.dataset.index
    if (index == 0 && that.data.tongzhi0.biaoti&&that.data.tongzhi0.neirong) {
      that.setData({
        tongzhihidden: false,
        title:that.data.tongzhi0.biaoti,
        neirong: that.data.tongzhi0.neirong,
      })
    }
    if (index == 1 && that.data.tongzhi1.biaoti && that.data.tongzhi1.neirong) {
      that.setData({
        tongzhihidden: false,
        title: that.data.tongzhi1.biaoti,
        neirong: that.data.tongzhi1.neirong,
      })
    }
    if (index == 2 && that.data.tongzhi2.biaoti && that.data.tongzhi2.neirong) {
      that.setData({
        tongzhihidden: false,
        title: that.data.tongzhi2.biaoti,
        neirong: that.data.tongzhi2.neirong,
      })
    }
  },
  tongzhicancel: function () {
    var that = this
    that.setData({ tongzhihidden: true })
  },
 tongzhiconfirm: function () {
    var that = this
   that.setData({ tongzhihidden: true })
  }, 
  ontapjianjie:function(){
   // var that = this

    wx.navigateTo({
      url: '/pages/keshijieshao/keshijieshao',
    })
  },
  jianjiecancel: function () {
    var that = this
    that.setData({ jianjiehidden: true })
  },
  jianjieconfirm: function () {
    var that = this
    that.setData({ jianjiehidden: true })
  }, 
  yingxiangfangshe: function () {
    console.log(11)
    var that = this
    that.setData({ jianjiehidden: true })
  },
  keshijieshao: function () {
    console.log(12)
    var that = this
    that.setData({ jianjiehidden: true })
  }
  /*
  ontapjianjie:function(){
    var that=this
    that.showModaljianjie()
  },
  showModaljianjie: function (e) {
    this.animateTrans.translateY(0).step()
    this.animateFade.opacity(1).step()
    this.setData({
      animationData: this.animateTrans.export(), //动画实例的export方法导出动画数据传递给组件的animation属性
      animationMask: this.animateFade.export()
    })

  },

  // 隐藏
  hideModaljianjie: function () {
    this.animateTrans.translateY(300).step()
    this.animateFade.opacity(0).step()
    this.setData({
      animationData: this.animateTrans.export(),
      animationMask: this.animateFade.export()
    })
  },
  yingxiangfangshe:function(){
    console.log(11)
    var that=this
    that.hideModaljianjie()
  },
  keshijieshao:function(){
    console.log(12) 
    var that = this
    that.hideModaljianjie()
  }*/









})
