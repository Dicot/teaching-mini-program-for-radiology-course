
const app = getApp()
var question = [{}], answer = [], ceyankey, ceyanid, colora = [''], colorb = [''], colorc = [''], colord = [''], selectcolor = '#98FB98', nowcolor = "", score;
var username, ceyanrenshu, yidatiflag,
  usershenfen, usershenfenid, cuotitimu, jihekey, mysuitangceyan,isceyan,tijiaoflag,
  time,cuotiarr=[];
var util = require('../../modules/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ceyankey,
    question,
    ceyanid,
    colora,
    colorb,
    colorc,
    colord,
    answer,
    nowcolor,
    score: 0,
    username,
    usershenfen,
    time,
    ceyanrenshu,
    usershenfenid,
    cuotiarr,
    yidatiflag:false,
    cuotitimu:[],
    jihekey,
    tijiaoflag:true,
    mysuitangceyan,
    isceyan:false
  }, 


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ username: app.globalData.username })
    that.setData({ usernumber: app.globalData.usernumber })
    that.data.usershenfenid=app.globalData.usershenfenid
     var time = util.formatDate(new Date());
    //再通过setData更改Page()里面的data，动态更新页面的数据
    that.setData({
      time: time,
      ceyankey: options.ceyankey
    });
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection('ceyantimu').where({
      ceyankey: that.data.ceyankey
    }).get().then(res => {
      console.log(that.data.ceyankey)
      console.log(res.data);
      that.data.ceyanid = res.data[0]._id
      if (!res.data[0].question) { res.data[0].question = [] }
      if (res.data[0].isceyan){
      that.setData({
        isceyan:res.data[0].isceyan,
        question: res.data[0].question,
      })}
      else if(!res.data[0].isceyan){that.setData({isceyan:res.data[0].isceyan})}
      if (res.data[0].zhou == "diyizhou") { that.data.jihekey = "diyizhouceyan", that.showpage()}
      if (res.data[0].zhou == "dierzhou") { that.data.jihekey = "dierzhouceyan", that.showpage()}
      if (res.data[0].zhou == "disanzhou") { that.data.jihekey = "disanzhouceyan", that.showpage()}
      if (res.data[0].zhou == "disizhou") { that.data.jihekey = "disizhouceyan", that.showpage()}
      console.log(that.data.ceyanid)
    })
    db.collection('userinformation').where({ _id: that.data.usershenfenid }).get().then(res => {
      if (!res.data[0].mysuitangceyan || res.data[0].mysuitangceyan.length == 0) { res.data[0].mysuitangceyan = [] }
      that.setData({
        mysuitangceyan: res.data[0].mysuitangceyan
      })
      console.log(that.data.mysuitangceyan)
    })


  },
  showpage:function(){
    var that=this
    const db = wx.cloud.database();
    db.collection(that.data.jihekey).where({ datinumber: that.data.usernumber }).get().then(res => {
      if (res.data[0]) {
        console.log("yidati")
        that.data.yidatiflag = true
      }
      else{console.log(1)}
    })
    console.log(that.data.yidatiflag)
  },
  clickb: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    console.log(index)
    // that.data.colora[index]=selectcolor
    console.log(selectcolor)
    var nowcolorb = 'colorb[' + index + ']'
    var nowcolora = 'colora[' + index + ']'
    var nowcolorc = 'colorc[' + index + ']'
    var nowcolord = 'colord[' + index + ']'
    that.setData({ [nowcolorb]: selectcolor, [nowcolora]: "", [nowcolorc]: "", [nowcolord]: "" })
    //console.log(nowcolor)
    answer[index] = 'B'
    console.log(answer[index])
  },
  clickc: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    console.log(index)
    // that.data.colora[index]=selectcolor
    console.log(selectcolor)
    var nowcolorb = 'colorb[' + index + ']'
    var nowcolora = 'colora[' + index + ']'
    var nowcolorc = 'colorc[' + index + ']'
    var nowcolord = 'colord[' + index + ']'
    that.setData({ [nowcolorc]: selectcolor, [nowcolora]: "", [nowcolorb]: "", [nowcolord]: "" })
    //console.log(nowcolor)
    answer[index] = 'C'
    console.log(answer[index])
  },
  clickd: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    console.log(index)
    // that.data.colora[index]=selectcolor
    console.log(selectcolor)
    var nowcolorb = 'colorb[' + index + ']'
    var nowcolora = 'colora[' + index + ']'
    var nowcolorc = 'colorc[' + index + ']'
    var nowcolord = 'colord[' + index + ']'
    that.setData({ [nowcolord]: selectcolor, [nowcolora]: "", [nowcolorc]: "", [nowcolorb]: "" })
    //console.log(nowcolor)
    answer[index] = 'D'
    console.log(answer[index])
  },
  clicka: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    console.log(index)
    // that.data.colora[index]=selectcolor
    console.log(selectcolor)
    var nowcolorb = 'colorb[' + index + ']'
    var nowcolora = 'colora[' + index + ']'
    var nowcolorc = 'colorc[' + index + ']'
    var nowcolord = 'colord[' + index + ']'
    that.setData({ [nowcolora]: selectcolor, [nowcolorb]: "", [nowcolorc]: "", [nowcolord]: "" })
    //console.log(nowcolor)
    answer[index] = 'A'
    console.log(answer[index])
  },

tijiao:function(){
  var that=this
  if(that.data.tijiaoflag){
  that.tijiaodelay()}
that.data.tijiaoflag=false
},

  tijiaodelay: function () {
    var that = this;
    //const db = wx.cloud.database();
  
    if(!that.data.yidatiflag){
    if (true) {
    for (var i = 0; i < answer.length; i++) { 
      console.log(that.data.question[i].trueanswer)
      if (answer[i] == that.data.question[i].trueanswer) { that.data.score++ }
      else{
        that.data.cuotiarr.push(i),
        that.data.cuotitimu.push(that.data.question[i])
      }
     console.log(that.data.cuotiarr,that.data.cuotitimu)
       }
    //console.log('defen', that.data.score)
    var that = this;
    //that.data.ceyanrenshu++
    that.data.dangqiansuitangceyan = {
      datiname: that.data.username,
      datitime: that.data.time,
      datianswer: answer,
      datiscore: that.data.score,
      cuotiji: that.data.cuotiarr,
      ceyanid: that.data.ceyanid,
      cuotitimu:that.data.cuotitimu
    }
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    that.data.mysuitangceyan.push(that.data.dangqiansuitangceyan)
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection(that.data.jihekey).add({
      data: {
        datiname: that.data.username,
        datitime: that.data.time,
        datianswer: answer,
        datiscore: that.data.score,
        datinumber:that.data.usernumber,
        cuotiji: that.data.cuotiarr,
        ceyankey:that.data.ceyankey
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res);
        console.log(res.errMsg);
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
        })
        wx.redirectTo({
          url: '../../pages/xueshengjiaoxuejiemian/xueshengjiaoxuejiemian',
        })  
      }
    })
      wx.cloud.callFunction({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          jihe: "userinformation",
          id: that.data.usershenfenid,
          mingcheng: 'mysuitangceyan',
          mysuitangceyan: that.data.mysuitangceyan
        },
        success: function (res) {
          console.log("更新成功", res)
        },
        fail: console.error
      })



    }else{
      wx.showToast({
        title: '请确认题目作答完全',
        icon:"none"
      })
    }

    } 
    else{
      wx.showToast({
        title: '请勿重复提交',
        icon: "none",
        duration: 1000
      })
    }
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