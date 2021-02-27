  const app=getApp();
var util = require('../../modules/utils.js'); 
var username,usershenfen,time,key;
var yuxi = [], ceyan = [], ceyanflag=[],yuxiflag=[],index;
var cuotitongji = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],shitiarr; //10道题
var currentPage, linshicurrentPage, ceyancurrentPage, isfocus, total,zhou, jihekey1, jihekey2, yuxikey, yuxitimu, zhucedengluid, yuxistuinfo, ceyanmodalhidden, ceyancunzai,yuximodalhidden;// 当前第几页,0代表第一页   
var pageSize = 10; //每页显示多少数据 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username, usershenfen, time,
    yuxi, ceyan, ceyanflag, yuxiflag, key,
    animationData: {}, //内容动画
    animationMask: {}, //蒙板动画
    index,
    currentPage,
    pageSize,
    linshicurrentPage,
    isfocus,
    ceyancurrentPage,
    pageheight:1500,
    cuotitongji,
    shitiarr,
    zhou,
    jihekey1,
    jihekey2,
    yuxikey,
    yuxitimu,
    yuxistuinfo,
    zhucedengluid,
    ceyanmodalhidden:true,
    yuximodalhidden:true,
    ceyantimuflag:true,
    ceyancunzai:false,
    total,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.linshicurrentPage) { that.setData({ currentPage: options.linshicurrentPage }) }
    if (!that.data.currentPage) { that.setData({ currentPage: 0 }) }
    console.log(that.data.currentPage)
    that.animateTrans = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })

    that.animateFade = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    that.setData({ username: app.globalData.username })
    that.setData({ usershenfen: app.globalData.usershenfen })
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time,
      key:options.key,
      zhou:options.zhou
    });
    // 初始化数据库
    if (that.data.zhou == "diyizhou") {that.data.jihekey1 = 'diyizhouyuxi', that.data.jihekey2 = 'diyizhouceyan'}
    if (that.data.zhou == "dierzhou") { that.data.jihekey1 = 'dierzhouyuxi', that.data.jihekey2 = 'dierzhouceyan'}
    if (that.data.zhou == "disanzhou") { that.data.jihekey1 = 'disanzhouyuxi', that.data.jihekey2 = 'disanzhouceyan'}
    if (that.data.zhou == "disizhou") { that.data.jihekey1 = 'disizhouyuxi', that.data.jihekey2 = 'disizhouceyan'}
    if(that.data.key=="yuxi"){
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true})
      const db = wx.cloud.database();
      db.collection(that.data.jihekey1).where({}).count({
        success: function (res) {
          console.log(res.total)
          that.setData({ total: res.total })
        }
      })
      db.collection('yuxitimu').where({zhou:that.data.zhou}).get().then(res=>{
        if(res.data[0]){
          that.setData({ yuxitimu: res.data[0], ceyancunzai: true})
          console.log(that.data.yuxitimu)
          db.collection(that.data.jihekey1)
            .skip(that.data.currentPage * pageSize) //从第几个数据开始
            .limit(pageSize)
            .get().then(res => {
              if (res.data && res.data.length > 0) {
                console.log("请求成功", res.data)
                console.log(that.data.currentPage)
                that.data.currentPage++
                console.log(that.data.currentPage)
                //var linshitopics=res.data
                that.setData({   
                  yuxi: res.data,
                  currentPage: that.data.currentPage
                })
              }
              else{
                that.setData({
                  yuxi: [],
                  currentPage: that.data.currentPage
                })
              }
            })
        }
        else {
          that.setData({
            ceyancunzai: false
          })
          wx.showToast({
            title: '未找到数据',
            icon: "none"
          })
        }   
      })}

    if(that.data.key=="ceyan"){
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    })
    const db = wx.cloud.database();
      db.collection(that.data.jihekey2).where({}).count({
        success: function (res) {
          console.log(res.total)
          that.setData({ total: res.total })
        }
      })
    db.collection('ceyantimu').where({ zhou: that.data.zhou }).get().then(res => {
      if (res.data[0]) {
        that.setData({ ceyantimu: res.data[0], ceyancunzai: true })
        console.log(that.data.ceyantimu)
        db.collection(that.data.jihekey2)
          .skip(that.data.currentPage * pageSize) //从第几个数据开始
          .limit(pageSize)
          .get().then(res => {
            if (res.data && res.data.length > 0) {
              console.log("请求成功", res.data)
              console.log(that.data.currentPage)
              that.data.currentPage++
              console.log(that.data.currentPage)
              //var linshitopics=res.data
              that.setData({
                ceyan: res.data,
                currentPage: that.data.currentPage
              })
            }
          })
      }
      else {
        that.setData({
          ceyancunzai: false
        })
        wx.showToast({
          title: '未找到数据',
          icon: "none"
        })
      }



    })}
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
        url: '../../pages/ceyanliulan/ceyanliulan?linshicurrentPage=' + that.data.linshicurrentPage+"&key="+that.data.key+"&zhou="+that.data.zhou
      })
    }
  },
  ontapxiayiye: function () {
    var that = this
    that.data.linshicurrentPage = that.data.currentPage
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    wx.redirectTo({
      url: '../../pages/ceyanliulan/ceyanliulan?linshicurrentPage=' + that.data.linshicurrentPage + "&key=" + that.data.key + "&zhou=" + that.data.zhou})
  },
  ontapshangyiye: function () {
    var that = this
    that.data.linshicurrentPage = that.data.currentPage - 2;
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    wx.redirectTo({
      url: '../../pages/ceyanliulan/ceyanliulan?linshicurrentPage=' + that.data.linshicurrentPage + "&key=" + that.data.key + "&zhou=" + that.data.zhou
    })
  },
  changeceyanflag: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.ceyanflag[index]) {
      this.data.ceyanflag[index] = false;
     // this.data.pageheight=1500
          
      } else {
      this.data.ceyanflag[index] = true;
     // this.data.pageheight=10000
    }
    this.setData({
    //  pageheight: this.data.pageheight,
      ceyanflag: this.data.ceyanflag
    })
  },
  changeyuxiflag: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.yuxiflag[index]) {
      this.data.yuxiflag[index] = false;
     // this.data.pageheight = 1500
    } else {
      this.data.yuxiflag[index] = true;
    //  this.data.pageheight = 10000
    }
    this.setData({
      yuxiflag: this.data.yuxiflag,
     // pageheight: this.data.pageheight,
    })
  },
  showyuxi:function(){
    var that = this
    that.setData({ yuximodalhidden: false })
  },
  kaishiyuxi:function(e){
    var that=this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update',
      // 传给云函数的参数
      data: {
        jihe:"yuxitimu",
        id: that.data.yuxitimu._id,
        mingcheng: 'isceyan',
        neirong:true
      },
      success: function (res) {
        console.log("更新成功", res)
      },
      fail: console.error
    })
   // var nowisyuxi = 'yuxi[' + that.data.index + '].isceyan'
    that.data.yuxitimu.isceyan=true
      that.setData({yuxitimu:that.data.yuxitimu,yuximodalhidden:true})
  },
  tingzhiyuxi:function(e){
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update',
      // 传给云函数的参数
      data: {
        jihe: "yuxitimu",
        id: that.data.yuxitimu._id,
        mingcheng: 'isceyan',
        neirong: false
      },
      success: function (res) {
        console.log("更新成功", res)
      },
      fail: console.error
    })
    that.data.yuxitimu.isceyan = false
    that.setData({ yuxitimu: that.data.yuxitimu, yuximodalhidden: true  })
  },
 
showceyan:function(){
var that=this
that.setData({ceyanmodalhidden:false})
 },

  kaishiceyan: function (e) {
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update',
      // 传给云函数的参数
      data: {
        jihe: "ceyantimu",
        id: that.data.ceyantimu._id,
        mingcheng: 'isceyantimu',
        isceyan: true,
        cuotiflag: false,
      },
      success: function (res) {
        console.log("更新成功", res)
      },
      fail: console.error
    })
    that.data.ceyantimu.isceyan = true
    that.setData({ ceyantimu: that.data.ceyantimu,ceyanmodalhidden:true})

  },
  tingzhiceyan: function (e) {
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update',
      // 传给云函数的参数
      data: {
        jihe: "ceyantimu",
        id: that.data.ceyantimu._id,
        mingcheng: 'isceyantimu',
        isceyan: false,
        cuotiflag:true,
      },
      success: function (res) {
        console.log("更新成功", res)
      },
      fail: console.error
    })
    that.data.ceyantimu.isceyan = false
    that.setData({ ceyantimu: that.data.ceyantimu, ceyanmodalhidden: true})
  },
  changeceyantimuflag:function(){
    if (this.data.ceyantimuflag) {
      this.data.ceyantimuflag = false;
      // this.data.pageheight = 1500
    } else {
      this.data.ceyantimuflag = true;
      //  this.data.pageheight = 10000
    }
    this.setData({
      ceyantimuflag: this.data.ceyantimuflag,
      //pageheight: this.data.pageheight,
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