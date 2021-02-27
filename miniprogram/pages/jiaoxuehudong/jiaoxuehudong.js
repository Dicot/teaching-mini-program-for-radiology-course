 
var that
const app = getApp()
var currentPage;// 当前第几页,0代表第一页 
var pageSize = 10; //每页显示多少数据 
var topics=[],imgurls=[],isFolded=[];
var i=0;
var miaosu, linshicurrentPage, isfocus, shanchuhidden,shanchuid;
var usershenfen;
var username,time;
var util = require('../../modules/utils.js');
Page({
  data: {
    isfocus,
    currentPage,
    username,
    usershenfen,
    selectedFlag: [],
    topics: [],
    imgurls: [],
    miaosu,
    time,
    loadMore: false, //"上拉加载"的变量，默认false，隐藏  
    loadAll: false, //“没有数据”的变量，默认false，隐藏  
    linshicurrentPage,
    shanchuhidden:true,
    shanchuid,
  },
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.username, app.globalData.usershenfen)
    that.setData({ username: app.globalData.username })
    that.setData({ usershenfen: app.globalData.usershenfen })
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time,
    });
    if (options.linshicurrentPage) { that.setData({ currentPage: options.linshicurrentPage})}
  },
  onShow:function(){
    var that=this
    if (!that.data.currentPage) { that.setData({ currentPage:0 }) }
    console.log(that.data.currentPage)
    that.getData()
  },
  getData(){
    var that = this;
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    const db = wx.cloud.database();
    db.collection('hudong')
    .skip(that.data.currentPage * pageSize) //从第几个数据开始
    .limit(pageSize)
    .orderBy('hudongtime', 'desc')
    .get({  
      //如果查询成功的话    
      success: function (res) {
        if (res.data && res.data.length > 0) {
          console.log("请求成功", res.data)
          console.log(that.data.currentPage)
          that.data.currentPage++
          console.log(that.data.currentPage)
          //var linshitopics=res.data
        that.setData({
          topics: res.data,
          currentPage: that.data.currentPage
        })
          //topics=topics.reverse()
        }
      }
    })
  },
  changeToggle: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }
    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },
  huifuinput:function(e){
    var id = e.currentTarget.dataset.id;
    var sfid=e.currentTarget.dataset.shenfenid;
    var that = this
    that.setData({
      miaosu: e.detail.value
    }) 
  },
  huifutijiao:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var sfid = e.currentTarget.dataset.shenfenid;
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update',
      // 传给云函数的参数
      data: {
        jihe: 'hudong',
        id: id,
        mingcheng: 'reply',
        reply_name: that.data.username,
        reply_time: that.data.time,
        reply_miaosu: that.data.miaosu,
      },
      success: function (res) {
        console.log("更新成功", res)
        const db = wx.cloud.database();
        db.collection("userinformation").where({ _id: sfid }).get().then(res => {
          var temparr = res.data[0].myhudong
          for (var i = 0; i < res.data[0].myhudong.length; i++) {
            if (res.data[0].myhudong[i].hudongid == id) {
              temparr[i].reply_name = that.data.username,
                temparr[i].reply_time = that.data.time,
                temparr[i].reply_miaosu = that.data.miaosu
              wx.cloud.callFunction({
                // 云函数名称
                name: 'update',
                // 传给云函数的参数
                data: {
                  jihe: "userinformation",
                  id: sfid,
                  mingcheng: 'myhudongreply',
                  myhudong: temparr,
                  weiduxiaoxi: true,
                  weiduindex: i
                },
                success: function (res) {
                  console.log("更新成功", res)
                  wx.showToast({
                    title: '提交成功',
                    icon:"none",
                    duration:1000
                  })
                },
                fail: console.error
              })

            }
          }
        }
        )
      },
      fail: console.error
    })
  },
    ontaptiwen:function(){
      wx.redirectTo({
        url: '../../pages/publish/publish',
      })
    },
  previewimgs:function(e){
    var that = this;
    var url = e.currentTarget.dataset.url;
    console.log(url)
    wx.previewImage({
      current: url[0], // 当前显示图片的http链接
      urls: url
    })
  },

  pageinput:function(e){
  var that=this;
    that.setData({isfocus:true})
    that.data.linshicurrentPage=e.detail.value
    that.setData({ linshicurrentPage: that.data.linshicurrentPage }) //, isfocus: false
    //console.log()
  },
  ontaptiaozhuan:function(){
  var that=this
    that.data.linshicurrentPage = that.data.linshicurrentPage-1;
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    if (that.data.linshicurrentPage) {
    wx.redirectTo({
      url: '../../pages/jiaoxuehudong/jiaoxuehudong?linshicurrentPage='+that.data.linshicurrentPage
    })}
  },
  ontapxiayiye:function(){
    var that = this
    that.data.linshicurrentPage = that.data.currentPage 
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    wx.redirectTo({
      url: '../../pages/jiaoxuehudong/jiaoxuehudong?linshicurrentPage=' + that.data.linshicurrentPage
    })
  },
  ontapshangyiye: function () {
    var that = this
    that.data.linshicurrentPage = that.data.currentPage-2;
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage=0}
    wx.redirectTo({
      url: '../../pages/jiaoxuehudong/jiaoxuehudong?linshicurrentPage=' + that.data.linshicurrentPage
    })
  },
  hudongshanchu: function (e) {
    var that=this
    that.data.shanchuid = e.currentTarget.dataset.id;
    that.setData({shanchuhidden:false})
  },
  shanchuqueren:function(){
    var that=this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'delete',
      // 传给云函数的参数
      data: {
        jihe: "hudong",
        id: that.data.shanchuid,
      },
      success: function (res) {
        console.log("更新成功", res)
        wx.redirectTo({
          url: '../../pages/jiaoshijiaoxuejiemian/jiaoshijiaoxuejiemian',
        })
      },
      fail: console.error
    })
    that.setData({ shanchuhidden: true })
  },
  shanchuquxiao:function(){
    var that=this
    that.setData({ shanchuhidden: true })
  },
 

})