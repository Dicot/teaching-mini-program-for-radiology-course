const app = getApp();
var usershenfen;
var username, time, jihe, yingxiangid, shanchuflag, mingcheng, shanchuindex,shanchuhidden;
//var util = require('../../modules/utils.js');
Page({
  data: {
    username,
    usershenfen,
    imgurls: [],
    photopath:[],
    time,
    jihe:"",
    mingcheng:"",
    shanchuflag,
    yingxiangid,
    shanchuhidden: true,
    shanchuindex,
  },
  onLoad: function (options) {
    var that = this;
    if (app.globalData.usernumber == "157" || app.globalData.usernumber == "033" || app.globalData.usernumber == "117") { that.setData({ shanchuflag: true }) }
    //console.log(app.globalData.username, app.globalData.usershenfen)
    //that.setData({ username: app.globalData.username })
   // that.setData({ usershenfen: app.globalData.usershenfen })
    //var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    /*this.setData({
      time: time
    });*/
      that.setData({
        jihe:options.jihe,
        mingcheng:options.mingcheng
      })
      console.log(that.data.jihe,that.data.mingcheng)
  },
  onShow: function () {
    this.getData();
  },
  getData() {
    var that = this;
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
  
    const db = wx.cloud.database();
  
    db.collection(that.data.jihe).where({
      mingcheng:that.data.mingcheng
    })
      .get({
        //如果查询成功的话    
        success: function (res) {
          that.data.yingxiangid=res.data[0]._id
          that.setData({
           imgurls: res.data[0].photopath,
          })
          //console.log(res.data[0].photopath)
        }
      })
  },
  previewimg: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    console.log(url)
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url]
    })
  },
yingxiangshanchu: function(e) {
  var that=this
  that.data.shanchuindex = e.currentTarget.dataset.index;
  that.setData({ shanchuhidden: false })
},
 shanchuqueren: function () {
    var that = this
   var imgremoved = that.data.imgurls.splice(that.data.shanchuindex, 1)
   //console.log(that.data.jihe,that.data.yingxiangid,that.data.imgurls)
   wx.cloud.callFunction({
     // 云函数名称
     name: 'update',
     // 传给云函数的参数
     data: {
       jihe: that.data.jihe,
       id: that.data.yingxiangid,
       mingcheng: 'yingxiangziliao',
       photopath: that.data.imgurls
     },
     success: function (res) {
       console.log("更新成功", res)
       wx.redirectTo({
         url: '../../pages/loginsuccess/loginsuccess',
       })
     },
     fail: console.error
   })
   that.setData({ shanchuhidden: true })
 },
  shanchuquxiao: function () {
    var that = this
    that.setData({ shanchuhidden: true })
  },










})