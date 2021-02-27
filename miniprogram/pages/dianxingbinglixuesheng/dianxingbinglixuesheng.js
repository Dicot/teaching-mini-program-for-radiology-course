const app=getApp()  
var currentPage, linshicurrentPage, colora = [''], colorb = [''], colorc = [''], colord = [''], selectcolor = '#98FB98', nowcolor = "", nowzhenduan = "", username, shanchuindex, choosezhenduanflag, zhenduanneirong, isfocus, shanchuhidden, shanchuid, jihemingcheng, zhenduanhidden = [""], shanchuflag, time,jiaoshishenfen;// 当前第几页,0代表第一页 
var pageSize = 20; //每页显示多少数据 
var util = require('../../modules/utils.js'); 
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    dianxingbingli:[],
    bingliflag:[],
    currentPage,
    pageSize,
    linshicurrentPage,
    isfocus,
    username,
    shanchuflag:false,
    shanchuhidden: true,
    shanchuid,
    zhenduanhidden:[],
    colora,
    colorb,
    colorc,
    colord,
    nowcolor,
    nowzhenduan,
    zhenduanneirong:[],
    choosezhenduanflag:[],
     jihemingcheng,
     shanchuindex,
    jiaoshishenfen,
time,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    var that=this
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
    if (options.linshicurrentPage) { that.setData({ currentPage: options.linshicurrentPage }) }
    if (!that.data.currentPage) { that.setData({ currentPage: 0 }) }
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection('dianxingbingli')
    .skip(that.data.currentPage * pageSize) //从第几个数据开始
      .limit(pageSize)
      .orderBy('time', 'desc')
      .where({binglihidden:false})
      .get().then(res => {
        if (res.data && res.data.length > 0) {
          console.log("请求成功", res.data)
          console.log(that.data.currentPage)
          that.data.currentPage++
          console.log(that.data.currentPage)
          //var linshitopics=res.data
          that.setData({
            dianxingbingli: res.data,
            currentPage: that.data.currentPage
          })
        }
      });
  },
  changebingliflag: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.bingliflag[index]) {
      this.data.bingliflag[index] = false;
    } else {
      this.data.bingliflag[index] = true;
    }
    this.setData({
      bingliflag: this.data.bingliflag
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

  pageinput: function (e) {
    var that = this;
    that.setData({ isfocus: true })
    that.data.linshicurrentPage = e.detail.value
    that.setData({ linshicurrentPage: that.data.linshicurrentPage }) //, isfocus: false
    //console.log()
  },
  ontaptiaozhuan: function () {
    var that = this
    that.data.linshicurrentPage = that.data.linshicurrentPage - 1;
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    if (that.data.linshicurrentPage) {
      wx.redirectTo({
        url: '../../pages/dianxingbingli/dianxingbingli?linshicurrentPage=' + that.data.linshicurrentPage
      })
    }
  },
  ontapxiayiye: function () {
    var that = this
    that.data.linshicurrentPage = that.data.currentPage
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    wx.redirectTo({
      url: '../../pages/dianxingbingli/dianxingbingli?linshicurrentPage=' + that.data.linshicurrentPage
    })
  },
  ontapshangyiye: function () {
    var that = this
    that.data.linshicurrentPage = that.data.currentPage - 2;
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    wx.redirectTo({
      url: '../../pages/dianxingbingli/dianxingbingli?linshicurrentPage=' + that.data.linshicurrentPage
    })
  },
  bingliyincang:function(e){
var yincangid=e.currentTarget.dataset.id
    var binglihidden = e.currentTarget.dataset.binglihidden

    if(binglihidden){binglihidden=false}
    else{binglihidden=true}
    console.log(yincangid, binglihidden)
    wx.showToast({
      title: '更改状态中',
      icon:"none"
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update',
      // 传给云函数的参数
      data: {
        jihe: "dianxingbingli",
        id: yincangid,
        mingcheng:"bingliyincang",
        binglihidden: binglihidden,
      },
      success: function (res) {
        console.log("更新成功", res)
      wx.redirectTo({
        url: '../../pages/dianxingbingli/dianxingbingli',
      })
      },
      fail: console.error
    })





  },
  binglishanchu: function (e) {
    var that = this
    that.data.shanchuid = e.currentTarget.dataset.id;
    that.setData({ shanchuhidden: false })
  },
  shanchuqueren: function () {
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'delete',
      // 传给云函数的参数
      data: {
        jihe: "dianxingbingli",
        id: that.data.shanchuid,
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
  zhenduanqueren1:function(e){
    var that=this
var zhenduan = e.currentTarget.dataset.zhenduan
var index = e.currentTarget.dataset.index
if (!that.data.choosezhenduanflag[index]){
that.data.zhenduanneirong[index] = zhenduan
console.log(zhenduan,index,that.data.zhenduanneirong[index])
  var nowcolorb = 'colorb[' + index + ']'
  var nowcolora = 'colora[' + index + ']'
  var nowcolorc = 'colorc[' + index + ']'
  var nowcolord = 'colord[' + index + ']'
  that.setData({ [nowcolora]: selectcolor, [nowcolorb]: "", [nowcolorc]: "", [nowcolord]: ""})}
},
  zhenduanqueren2: function (e) {
    var that = this
    var zhenduan = e.currentTarget.dataset.zhenduan
    var index = e.currentTarget.dataset.index
    if (!that.data.choosezhenduanflag[index]) {
    that.data.zhenduanneirong[index] = zhenduan
    console.log(zhenduan, index, that.data.zhenduanneirong[index])
    var nowcolorb = 'colorb[' + index + ']'
    var nowcolora = 'colora[' + index + ']'
    var nowcolorc = 'colorc[' + index + ']'
    var nowcolord = 'colord[' + index + ']'
    that.setData({ [nowcolorb]: selectcolor, [nowcolora]: "", [nowcolorc]: "", [nowcolord]: ""})}
  },
  zhenduanqueren3: function (e) {
    var that = this
    var zhenduan = e.currentTarget.dataset.zhenduan
    var index = e.currentTarget.dataset.index
    if (!that.data.choosezhenduanflag[index]) {
    that.data.zhenduanneirong[index] = zhenduan
    console.log(zhenduan, index, that.data.zhenduanneirong[index])
    var nowcolorb = 'colorb[' + index + ']'
    var nowcolora = 'colora[' + index + ']'
    var nowcolorc = 'colorc[' + index + ']'
    var nowcolord = 'colord[' + index + ']'
    that.setData({ [nowcolorc]: selectcolor, [nowcolorb]: "", [nowcolora]: "", [nowcolord]: ""})}
  },
  zhenduanqueren4: function (e) {
    var that = this
    var zhenduan = e.currentTarget.dataset.zhenduan
    var index = e.currentTarget.dataset.index
    if (!that.data.choosezhenduanflag[index]) {
    that.data.zhenduanneirong[index] = zhenduan
    console.log(zhenduan, index, that.data.zhenduanneirong[index])
    var nowcolorb = 'colorb[' + index + ']'
    var nowcolora = 'colora[' + index + ']'
    var nowcolorc = 'colorc[' + index + ']'
    var nowcolord = 'colord[' + index + ']'
    that.setData({ [nowcolord]: selectcolor, [nowcolorb]: "", [nowcolorc]: "", [nowcolora]: ""})}
  },
  zhenduanqueren: function (e) {
    var that=this
    var index = e.currentTarget.dataset.index
    var jihe=e.currentTarget.dataset.jihe
    console.log("jihe",jihe)
    console.log(index, that.data.zhenduanneirong[index])
    if (that.data.zhenduanneirong[index]){
      that.data.choosezhenduanflag[index] = true
  var nowzhenduan = 'zhenduanhidden[' + index + ']'
  that.setData({ [nowzhenduan]: true })
      wx.cloud.callFunction({
        name: 'dataexist', //云函数的名称
        data: {
          jihe: jihe, //传入云函数event中
         //chaxunname:usernumber,
          chaxundata:app.globalData.usernumber
        },
        success: res => {
          console.log(res.result.data[0])  //res的数据结构如下图
          if (res.result.data[0]) { console.log("yitianjia") }
          else if (!res.result.data[0] && app.globalData.usershenfen=="学生") {
            console.log("weizhaodao")
            wx.cloud.callFunction({
              // 云函数名称
              name: 'addjianbiezhenduan',
              // 传给云函数的参数
              data: {
                jihe: jihe,
                username: app.globalData.username,
                usernumber: app.globalData.usernumber,
                jianbiezhenduanneirong: that.data.zhenduanneirong[index],
                time: parseInt(that.data.time)
              },
              success: function (res) {
                console.log("更新成功", res)
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              },
              fail: console.error
            })
          }
          else{console.log("jiaoshishenfen")}
        },
        fail: err => {
          console.error('[云函数]  调用失败', err)
        }
      })

       

  }
  else{wx.showToast({
    title: '请选择可能的诊断',
    icon:"none",
    duration:500
  })}
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
    
  }
})