
 const app=getApp()
var util = require('../../modules/utils.js');
var jinriqiandaoma, jinqiandaoma, isqiandao, jianjiehidden, zhou, temparr,dangqianqiandao;
Page({
  data: {
    jinriqiandaoma,
    jinqiandaoma,
    isqiandao,
    jianjiehidden: true,
    zhou:"",
    temparr,
    dangqianqiandao,
  },
  onLoad: function () {
    var that=this
    // 调用函数时，传入new Date()参数，返回值是日期和时间
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
    db.collection('zhucedengluma').where({
    }).get().then(res => {
      console.log(res.data[0])
      that.data.dangqianqiandao=res.data[0]
      })
  },
  ontapfabuqiandao:function(){
    var that=this
    that.ontapjianjie()
  },
  ontapfabu:function(){
     var that=this
      if (that.data.dangqianqiandao.qiandaoma == that.data.time){wx.showToast({
        title: '请勿重复发布',
        icon:"none"
      })}
      else {
        if(that.data.zhou=='diyizhou'){
          that.data.temparr = that.data.dangqianqiandao.diyizhouqiandao
          that.data.temparr.push(that.data.time)
        console.log(that.data.temparr)
          wx.cloud.callFunction({
            // 云函数名称
            name: 'update',
            // 传给云函数的参数
            data: {
              jihe: "zhucedengluma",
              id: that.data.dangqianqiandao._id,
              mingcheng: 'diyizhouqiandao',
              diyizhouqiandao: that.data.temparr,
              qiandaoma: that.data.time,
              dangqianzhou:"diyizhouqiandao"
            },
            success: function (res) {
              console.log("更新成功", res)
              wx.showToast({
                title: '发布成功',
                duration:1000
              })
            },
            fail: console.error
          })


        }
        if (that.data.zhou == 'dierzhou') {
          that.data.temparr = that.data.dangqianqiandao.dierzhouqiandao, that.data.temparr.push(that.data.time)
          wx.cloud.callFunction({
            // 云函数名称
            name: 'update',
            // 传给云函数的参数
            data: {
              jihe: "zhucedengluma",
              id: that.data.dangqianqiandao._id,
              mingcheng: 'dierzhouqiandao',
              dierzhouqiandao: that.data.temparr,
              qiandaoma: that.data.time,
              dangqianzhou: "dierzhouqiandao"
            },
            success: function (res) {
              console.log("更新成功", res)
              wx.showToast({
                title: '发布成功',
                duration: 1000
              })
            },
            fail: console.error
          })
        }
        if (that.data.zhou == 'disanzhou') {
          that.data.temparr = that.data.dangqianqiandao.disanzhouqiandao, that.data.temparr.push(that.data.time)
          wx.cloud.callFunction({
            // 云函数名称
            name: 'update',
            // 传给云函数的参数
            data: {
              jihe: "zhucedengluma",
              id: that.data.dangqianqiandao._id,
              mingcheng: 'disanzhouqiandao',
              disanzhouqiandao: that.data.temparr,
              qiandaoma: that.data.time,
              dangqianzhou: "disanzhouqiandao"
            },
            success: function (res) {
              console.log("更新成功", res)
              wx.showToast({
                title: '发布成功',
                duration: 1000
              })
            },
            fail: console.error
          })
        }
        if (that.data.zhou == 'disizhou') {
          that.data.temparr = that.data.dangqianqiandao.disizhouqiandao, that.data.temparr.push(that.data.time)
          wx.cloud.callFunction({
            // 云函数名称
            name: 'update',
            // 传给云函数的参数
            data: {
              jihe: "zhucedengluma",
              id: that.data.dangqianqiandao._id,
              mingcheng: 'disizhouqiandao',
              disizhouqiandao: that.data.temparr,
              qiandaoma: that.data.time,
              dangqianzhou: "disizhouqiandao"
            },
            success: function (res) {
              console.log("更新成功", res)
              wx.showToast({
                title: '发布成功',
                duration: 1000
              })
            },
            fail: console.error
          })
        }
        }
    },
    ontapkaishiqiandao:function(){
      var that = this
      wx.cloud.callFunction({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          jihe: "zhucedengluma",
          id: that.data.dangqianqiandao._id,
          mingcheng: 'isqiandao',
          isqiandao: true,
        },
        success: function (res) {
          console.log("更新成功", res)
        },
        fail: console.error
      })
      that.setData({isqiandao:true})
      wx.showToast({
        title: '开始签到',
        icon:"none"
      })
    },
    ontaptingzhiqiandao:function(){
      var that = this
      wx.cloud.callFunction({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          jihe: "zhucedengluma",
          id: that.data.dangqianqiandao._id,
          mingcheng: 'isqiandao',
          isqiandao: false,
        },
        success: function (res) {
          console.log("更新成功", res)
        },
        fail: console.error
      })
      that.setData({ isqiandao:false })
      wx.showToast({
        title: '终止签到',
        icon: "none"
      })
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
  diyizhou:function(){
    var that=this
    that.setData({ zhou: "diyizhou", jianjiehidden: true})
    console.log(that.data.zhou)
    that.ontapfabu()
  },
    dierzhou: function () {
    var that = this
      that.setData({ zhou: "dierzhou", jianjiehidden: true })
      console.log(that.data.zhou)
      that.ontapfabu()
  },
    disanzhou: function () {
    var that = this
      that.setData({ zhou: "disanzhou", jianjiehidden: true })
      console.log(that.data.zhou)
      that.ontapfabu()
  },
    disizhou: function () {
    var that = this
      that.setData({ zhou: "disizhou", jianjiehidden: true })
      console.log(that.data.zhou)
      that.ontapfabu()
  },

  
})
