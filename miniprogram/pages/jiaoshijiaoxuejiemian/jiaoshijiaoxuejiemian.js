 
 const app = getApp()
var usershenfen;
var username,jianjiehidden, zhou;
var ishidden,istongzhihidden,key,pagekey;
Page({
  data: {
    username,
    usershenfen,    istongzhihidden:true,
    tongzhikey: ["zijiemiantongzhi1", "zijiemiantongzhi2", "zijiemiantongzhi3"],
    tongzhi0: {},
    tongzhi1: {},
    tongzhi2: {},
    tongzhihidden: true,
    ishidden:true,
    photopath: [],
    title: "",
    neirong: "",
    jianjiehidden: true,
    zhou: "",
    pagekey,
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
  ontapfabuqiandao: function () {
    wx.navigateTo({
      url: '/pages/fabuqiandao/fabuqiandao',
    })
  },
  ontapfabuyuxi: function () {
    wx.navigateTo({
      url: '/pages/fabuceyan/fabuceyan',
    })
  },

  ontapqiandaoliulan:function(){
    var that=this
    that.data.pagekey="qiandao"
    that.ontapjianjie()
  },
  ontapceyanliulan: function () {
    var that = this
    that.data.pagekey = "ceyan"
    that.ontapjianjie()

  },
  ontapyuxiliulan: function () {
    var that = this
    that.data.pagekey = "yuxi"
    that.ontapjianjie()
  }, 
  ontapshangchuanyingxiang:function(){
    wx.navigateTo({
      url: '/pages/shangchuanyingxiang/shangchuanyingxiang',
    })
  },
  ontapshangchuanbingli: function () {
    wx.navigateTo({
      url: '/pages/shangchuanbingli/shangchuanbingli',
    })
  },
  ontapjiaoxuehudong: function () {
    wx.navigateTo({
      url: '/pages/jiaoxuehudong/jiaoxuehudong',
    })
  },
  ontapshangchuanshiti:function(){
    wx.navigateTo({
      url: '/pages/shangchuanshiti/shangchuanshiti',
    })
  },
  ontapshitiliulan:function(){
    wx.navigateTo({
      url: '/pages/shitiliulan/shitiliulan',
    })
  },
  ontapfabutongzhi:function(){
    var that=this
    that.setData({ishidden:false})
  },
  cancel:function(){
    var that = this
    that.setData({ ishidden:true })
  },
  confirm:function(){
    var that = this
    that.setData({ ishidden: true })
  },
  tongzhiconfirm:function(e){
    var that=this
    that.setData({ ishidden: true })
    var key = e.currentTarget.dataset.key
    wx.navigateTo({
      url: '../../pages/fabutongzhi/fabutongzhi?key='+key,
    })
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
  tongzhi1confirm: function () {
    var that = this
    that.setData({ tongzhihidden: true })
  },

  ontapjianjie: function () {
    var that = this
    that.setData({ jianjiehidden: false })
  },
  jianjiecancel: function () {
    var that = this
    that.setData({ jianjiehidden: true })
  },
  jianjieconfirm: function () {
    var that = this
    that.setData({ jianjiehidden: true })
  },
  diyizhou: function () {
    var that = this
    that.setData({ zhou: "diyizhou", jianjiehidden: true })
    console.log(that.data.zhou)
    if(that.data.pagekey=="qiandao"){
    that.data.pagekey = ""
      wx.navigateTo({

      url: '/pages/qiandaoliulan/qiandaoliulan?zhou=' + that.data.zhou,
    })
  }
    if (that.data.pagekey == "yuxi") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/ceyanliulan/ceyanliulan?key=yuxi'+"&zhou="+that.data.zhou,
      })
    }
    if (that.data.pagekey == "ceyan") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/ceyanliulan/ceyanliulan?key=ceyan' + "&zhou=" + that.data.zhou,
      })
    }
  },
  dierzhou: function () {
    var that = this
    that.setData({ zhou: "dierzhou", jianjiehidden: true })
    console.log(that.data.zhou)
    if (that.data.pagekey == "qiandao") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/qiandaoliulan/qiandaoliulan?zhou=' + that.data.zhou,
      })
    }
    if (that.data.pagekey == "yuxi") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/ceyanliulan/ceyanliulan?key='+'yuxi' + "&zhou=" + that.data.zhou,
      })
    }
    if (that.data.pagekey == "ceyan") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/ceyanliulan/ceyanliulan?key='+'ceyan' + "&zhou=" + that.data.zhou,
      })
    }
  },
  disanzhou: function () {
    var that = this
    that.setData({ zhou: "disanzhou", jianjiehidden: true })
    console.log(that.data.zhou)
    if (that.data.pagekey == "qiandao") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/qiandaoliulan/qiandaoliulan?zhou=' + that.data.zhou,
      })
    }
    if (that.data.pagekey == "yuxi") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/ceyanliulan/ceyanliulan?key=yuxi' + "&zhou=" + that.data.zhou,
      })
    }
    if (that.data.pagekey == "ceyan") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/ceyanliulan/ceyanliulan?key=ceyan' + "&zhou=" + that.data.zhou,
      })
    }
  },
  disizhou: function () {
    var that = this
    that.setData({ zhou: "disizhou", jianjiehidden: true })
    console.log(that.data.zhou)
    if (that.data.pagekey == "qiandao") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/qiandaoliulan/qiandaoliulan?zhou=' + that.data.zhou,
      })
    }
    if (that.data.pagekey == "yuxi") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/ceyanliulan/ceyanliulan?key=yuxi' + "&zhou=" + that.data.zhou,
      })
    }
    if (that.data.pagekey == "ceyan") {
      that.data.pagekey = ""
      wx.navigateTo({
        url: '/pages/ceyanliulan/ceyanliulan?key=ceyan' + "&zhou=" + that.data.zhou,
      })
    }
  },


})
