
const app=getApp();
var util = require('../../modules/utils.js');
var username,usershenfen,usernumber,time,weiduxiaoxi;
var myhudong=[],myceyan=[],myqiandao=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username,
    usershenfen,
    usernumber,
    time,
    myhudong,
    myceyan,
    myqiandao,
    weiduxiaoxi,
    qunnumber:"943035344"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    console.log(app.globalData.username, app.globalData.usershenfen)
    that.setData({ username: app.globalData.username })
    that.setData({ usershenfen: app.globalData.usershenfen, usershenfenid: app.globalData.usershenfenid })
    that.setData({ usernumber: app.globalData.usernumber })
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection("userinformation").where({_id:that.data.usershenfenid}).get().then(res=>{
      that.setData({weiduxiaoxi:res.data[0].weiduxiaoxi})
      console.log(that.data.weiduxiaoxi)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.editTabBar();    //显示自定义的底部导航
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  copyText: function () {
    let that = this
    //获取剪切板内容
    wx.getClipboardData({
      success(res) {
        wx.setClipboardData({
          data: that.data.qunnumber,

        })
      }
    })
  },
  tuichudenglu:function(){
    app.globalData.username = "";
    app.globalData.usernumber ="" ;
    app.globalData.usershenfen = "";
    app.globalData.usershenfenid ="" ;
    wx.reLaunch({
      url: '../../pages/index/index',
    })
  }







})