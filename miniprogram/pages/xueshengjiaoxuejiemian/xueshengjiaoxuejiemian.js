 const app = getApp()
var usershenfen;
var username, ishidden,isyuxihidden,ceyankey,yuxikey;
Page({
  data: {
    username,
    usershenfen,
    ishidden:true,
    ceyankey,
    yuxikey,
    isyuxihidden:true,
    tongzhikey: ["zijiemiantongzhi1", "zijiemiantongzhi2", "zijiemiantongzhi3"],
    tongzhi0: {},
    tongzhi1: {},
    tongzhi2: {},
    tongzhihidden: true,
    photopath: [],
    title: "",
    neirong: "",
  },
  onLoad: function () {
    var that = this;
    console.log(app.globalData.username, app.globalData.usershenfen)
    that.setData({ username: app.globalData.username })
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
      that.setData({ tongzhi0: res.data[0] })
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
  },
  ontapsuitangceyan: function () {
    var that = this
    that.setData({ ishidden: false })
  },
  cancel: function () {
    var that = this
    that.setData({ ishidden: true })
  },
  confirm: function () {
    var that = this
    that.setData({ ishidden: true })
    wx.redirectTo({
      url: '../../pages/suitangceyan/suitangceyan?ceyankey='+that.data.ceyankey,
    })
  },
  ceyankey: function (e) {
    var that = this
    that.setData({ ceyankey: e.detail.value })
    console.log(that.data.ceyankey)
  },

  ontapshangkeqiandao:function(){
    wx.redirectTo({
      url: '../../pages/xueshengqiandao/xueshengqiandao',
    })
  },
  ontapjiaoxuehudong:function(){
    wx.redirectTo({
      url: '../../pages/jiaoxuehudong/jiaoxuehudong',
    })
  }, 
   ontapkeqianyuxi: function () {
    var that = this
    that.setData({ isyuxihidden: false })
  },
  yuxicancel: function () {
    var that = this
    that.setData({ isyuxihidden: true })
  },
  yuxiconfirm: function () {
    var that = this
    that.setData({ isyuxihidden: true })
    wx.redirectTo({
      url: '../../pages/ketangceyan/ketangceyan?yuxikey=' + that.data.ceyankey,
    })
  },
   yuxikey: function (e) {
    var that = this
    that.setData({ ceyankey: e.detail.value })
    console.log(that.data.ceyankey)
  },
  tongzhixiangqing: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    if (index == 0 && that.data.tongzhi0.biaoti && that.data.tongzhi0.neirong) {
      that.setData({
        tongzhihidden: false,
        title: that.data.tongzhi0.biaoti,
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








})
