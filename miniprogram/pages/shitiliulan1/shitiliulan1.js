
 const app = getApp();
var usershenfen, ceyankey;
var username, time, jihe, mingcheng,xuanzedanshiti;
var util = require('../../modules/utils.js');
var currentPage, linshicurrentPage, isfocus;// 当前第几页,0代表第一页 
var pageSize = 20; //每页显示多少数据 
var xuanzeshitiku,timunumber,pageflag,zhou,jihekey;
Page({
  data: {
    username,
    usershenfen,
    imgurls: [],
    shitiku:[],
    photopath: [],
    time,
    jihe: "",
    mingcheng: "",
    shitiflag:[],
    xuanzeflag:[],
    xuanzeshitiku,
    ceyaninputhidden:false,
    xuanzedanshiti:{"option":"","photopath":"","tigan":"","trueanswer":""},
    timunumber,
    ceyankey:"",
    currentPage,
    pageSize,
    linshicurrentPage,
    isfocus,
    pageflag,
    tempflag:{"0":"","1":"","2":""},
    zhou,
    jihekey,
  },
  onLoad: function (options) {
    var that = this;
    //console.log(app.globalData.username, app.globalData.usershenfen)
    //that.setData({ username: app.globalData.username })
    // that.setData({ usershenfen: app.globalData.usershenfen })
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
    if (app.globalData.username == "游梦" || app.globalData.username == "王凯利" || app.globalData.username == "唐粤亭") { that.setData({ shanchuflag: true }) }
    if (options.linshicurrentPage) { 
      var temparr3=JSON.parse(options.xuanzeshitiku)
      var temparr4=JSON.parse(options.timunumber)
    that.setData({ currentPage: options.linshicurrentPage, 
                   xuanzeshitiku:temparr3, 
                    timunumber: temparr4 ,
                  }), 
    console.log(that.data.xuanzeshitiku, that.data.timunumber)}
    else{ that.setData({ currentPage: 0, xuanzeshitiku: [], timunumber: [],})
        console.log(that.data.xuanzeshitiku, that.data.timunumber)}
    that.setData({
      jihe: options.jihe,
      zhou:options.zhou
    })
    console.log(that.data.jihe,that.data.zhou)
  
  wx.cloud.init({
    env: 'tyttest-vqzij',
    traceUser: true
  });
  const db = wx.cloud.database();
  db.collection(that.data.jihe)
    .skip(that.data.currentPage * pageSize) //从第几个数据开始
    .limit(pageSize)
    .get().then(res => {
      //如果查询成功的话
        if(res.data && res.data.length > 0) {
      console.log("请求成功", res.data)
      console.log(that.data.currentPage)
      that.data.currentPage++
      console.log(that.data.currentPage)
      //var linshitopics=res.data
      that.setData({
        shitiku: res.data,
        currentPage: that.data.currentPage
      })
    }    
     console.log("试题库",that.data.shitiku)
    }).catch((e) => { });
  },
  changeshitiflag: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.shitiflag[index]) {
      this.data.shitiflag[index] = false;
    } else {
      this.data.shitiflag[index] = true;
    }
    this.setData({
      shitiflag: this.data.shitiflag
    })
  },
  ontapshitixuanze:function(e){
    var that=this
    var length=that.data.timunumber.length
    var index = e.currentTarget.dataset.index;
    if (that.data.xuanzeflag[index]) {
      that.data.xuanzeflag[index] = false;
      function findfirst(element){return element=index}
      var numberindex=that.data.timunumber.findIndex(findfirst)
      //console.log(that.data.timunumber.findIndex(index))
      console.log(numberindex)
      that.data.xuanzeshitiku.splice(numberindex,1)
      that.data.timunumber.splice(numberindex,1)
    } else {
      that.data.xuanzeflag[index] = true;
      delete that.data.shitiku[index]._id
      delete that.data.shitiku[index]._openid
      that.data.xuanzeshitiku.push(that.data.shitiku[index])
      that.data.timunumber.push(length)
      console.log(that.data.xuanzeshitiku, that.data.timunumber)
    }
    that.setData({
      xuanzeflag: that.data.xuanzeflag
    })
    console.log(that.data.xuanzeshitiku, that.data.timunumber)
  },
ceyankeyinput:function(e){
    var that=this
    that.setData({ceyaninputhidden:true})
    that.setData({ceyankey:e.detail.value})
},
shengchengceyan:function(){
  var that=this
  if (that.data.ceyankey.length==8){
  wx.cloud.init({
    env: 'tyttest-vqzij',
    traceUser: true
  });
  const db = wx.cloud.database();
 // if(that.data.zhou==diyizhou){that.data.jihekey="diyizhouceyan"}
  db.collection('ceyantimu').add({
      data:{
        ceyankey:that.data.ceyankey,
        isceyan:false,
        cuotiflag:false,
        question:that.data.xuanzeshitiku,
        time:that.data.time,
        shititongji:[],
        zhou:that.data.zhou
      },

      //成功的话    
      success: function (res) {
        //console.log(that.data.shitiku)
        wx.showToast({
          title: '发布成功',
          duration:1000
        })
        wx.redirectTo({
          url: '../../pages/jiaoshijiaoxuejiemian/jiaoshijiaoxuejiemian',
        })
      }
    })}
    else{
      wx.showToast({
        title: '请检查信息',
        icon:"none"
      })
    }
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
    var temparr1 = JSON.stringify(that.data.xuanzeshitiku);
    var temparr2=JSON.stringify(that.data.timunumber);
    that.data.linshicurrentPage = that.data.linshicurrentPage - 1;
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    if(that.data.linshicurrentPage){
    wx.redirectTo({
      url: '../../pages/shitiliulan1/shitiliulan1?linshicurrentPage=' + that.data.linshicurrentPage+"&jihe="+that.data.jihe+"&xuanzeshitiku="+temparr1+"&timunumber="+temparr2+"&zhou="+that.data.zhou
      })
    }
  },
  ontapxiayiye: function () {
    var that = this
    var temparr1 = JSON.stringify(that.data.xuanzeshitiku);
    var temparr2 = JSON.stringify(that.data.timunumber);
    that.data.linshicurrentPage = that.data.currentPage
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    wx.redirectTo({
      url: '../../pages/shitiliulan1/shitiliulan1?linshicurrentPage=' + that.data.linshicurrentPage + "&jihe=" + that.data.jihe + "&xuanzeshitiku=" + temparr1 + "&timunumber=" + temparr2 + "&zhou=" + that.data.zhou
    })
  },
  ontapshangyiye: function () {
    var that = this
    var temparr1 = JSON.stringify(that.data.xuanzeshitiku);
    var temparr2 = JSON.stringify(that.data.timunumber);
    that.data.linshicurrentPage = that.data.currentPage - 2;
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    wx.redirectTo({
      url: '../../pages/shitiliulan1/shitiliulan1?linshicurrentPage=' + that.data.linshicurrentPage + "&jihe=" + that.data.jihe + "&xuanzeshitiku=" + temparr1 + "&timunumber=" + temparr2 + "&zhou=" + that.data.zhou
    })
  },
  shitishanchu: function (e) {
    var that=this
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'delete',
      // 传给云函数的参数
      data: {
        jihe:that.data.jihe ,
        id: id,
      },
      success: function (res) {
        console.log("更新成功", res)
        wx.redirectTo({
          url: '../../pages/jiaoshijiaoxuejiemian/jiaoshijiaoxuejiemian',
        })
      },
      fail: console.error
    })
  },








})