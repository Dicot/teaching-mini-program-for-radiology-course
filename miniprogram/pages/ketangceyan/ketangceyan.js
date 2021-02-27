
//这个是预习
const app = getApp();
var usershenfen, username, time, usershenfenid;
const db = wx.cloud.database();
var util = require('../../modules/utils.js');
var ceyanmiaosu, photopath, studentinfo = {}, ceyanid, yidastudentinfo = [{}], mydati = [{}], updatedati=[{}];
var key, ceyanrenshu, isfocus,zhou,jihekey,sec;
Page({
  data: {
    username,
    isfocus,
    usershenfen,
    time,
    key,
    content: '',
    ceyanmiaosu,
    photopath,
    studentinfo,
    ceyanid,
    yidastudentinfo,
    mydati,
    updatedati,
    usershenfenid,
    ceyanrenshu,
    isceyan:false,
    zhou,
    jihekey,
    sec:true,
  },
  onLoad: function (options) {
    var that=this
    that.setData({ username: app.globalData.username })
    that.setData({ usernumber: app.globalData.usernumber })
    that.setData({ usershenfenid: app.globalData.usershenfenid })
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    that.setData({
      time: time,
      key:options.yuxikey
    });
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection('yuxitimu').where({
      ceyankey:that.data.key
    }).get().then(res => {
     // console.log(key)
      console.log(that.data.key)
      console.log(res.data);
      if(res.data[0].isceyan){
      that.setData({
        isceyan:true,
        ceyanmiaosu:res.data[0].ceyanmiaosu,
        photopath:res.data[0].photopath,
        ceyanid:res.data[0]._id,
        zhou:res.data[0].zhou
})
    }})
    db.collection('userinformation').where({_id:that.data.usershenfenid}).get().then(res =>{
      if (!res.data[0].myceyan) { res.data[0].myceyan = [] }
      that.setData({
        mydati:res.data[0].myceyan
      })
    })
  },
  
  /**
   * 获取填写的内容
   */
  contentinput: function (event) {
    var that = this
    that.setData({isfocus:true})
    that.data.content = event.detail.value;
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
  wenzijiance: function () {
    var that = this
    wx.showToast({
      title: '智能检测中',
      icon: "none",
    })
    wx.cloud.callFunction({
      name: 'msgsec',
      data: {
        text: that.data.content
      }
    }).then((res) => {
      console.log("检测结果", res.result);
      if(!that.data.content){wx.showToast({
        title: '写点东西吧',
        icon:"none"
      })}
      if (res.result.errCode == 0) {
        this.saveDataToServer();
        console.log("文字正常")
        wx.hideToast()
        wx.showToast({
          title: '检测通过',
          icon: "none",
        })
      } else if (res.result.errCode == 87014) {
        db.collection('minganxinxi').add({
          data: {
            username: app.globalData.username,
            usernumber: app.globalData.usernumber,
            minganxinxi: that.data.content
          }
        })
        wx.showToast({
          icon: 'none',
          title: '文字违规，后台已记录本次操作',
          duration: 1000
        })
        that.data.sec = false
      }
    })
  },
ontapsubmit:function(){
  var that=this
  console.log(that.data.content)
  that.wenzijiance();
},

saveDataToServer:function(){
   var that=this;
   if(that.data.sec){
   if(that.data.zhou=="diyizhou"){that.data.jihekey="diyizhouyuxi"}
   if (that.data.zhou == "dierzhou") { that.data.jihekey = "dierzhouyuxi" }
   if (that.data.zhou == "disanzhou") { that.data.jihekey = "disanzhouyuxi" }
   if (that.data.zhou == "disizhou") { that.data.jihekey = "disizhouyuxi" }
   that.data.updatedati={
     datiname: that.data.username,
     datitime: that.data.time,
     datimiaosu: that.data.content,
     timu:that.data.ceyanmiaosu,
     photopath:that.data.photopath,
   }
   wx.cloud.init({
     env: 'tyttest-vqzij',
     traceUser: true
   });
   that.data.mydati.push(that.data.updatedati)
   console.log(that.data.ceyanid)
   console.log(that.data.studentinfo)
   console.log(that.data.yidastudentinfo)
   // 初始化数据库
   const db = wx.cloud.database();
   console.log(that.data.jihekey)
   db.collection(that.data.jihekey).add({
    data: {
      datiname: that.data.username,
      datitime: that.data.time,
      datimiaosu: that.data.content,
      yuxikey:that.data.key,
      datinumber:that.data.usernumber
      },
    success: function (res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log(res);
      console.log(res.errMsg);
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1000,
      })
      wx.cloud.callFunction({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          jihe: "userinformation",
          id: that.data.usershenfenid,
          mingcheng: 'myceyan',
          myceyan: that.data.mydati
        },
        success: function (res) {
          console.log("更新成功", res)
        },
        fail: console.error
      })
      wx.redirectTo({
        url: '../../pages/xueshengjiaoxuejiemian/xueshengjiaoxuejiemian',
      })
    }
  })
   }
   else{
     wx.showToast({
       title: '请退出重试',
       icon: "none"
     })
   }



 }




})
  