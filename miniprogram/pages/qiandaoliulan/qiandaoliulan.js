
const app=getApp(); 
var currentPage, linshicurrentPage,isfocus,zhou,total,pagekey;// 当前第几页,0代表第一页 
var pageSize = 20; //每页显示多少数据 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiandaoinfo:[],
    ceyanflag:[],
    currentPage,
    pageSize,
    linshicurrentPage,
    isfocus,
    zhou,
    pagekey,
    total
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    that.data.zhou=options.zhou
    console.log("周数",that.data.zhou)
    if (options.linshicurrentPage) { that.setData({ currentPage: options.linshicurrentPage }) }
    if (!that.data.currentPage) { that.setData({ currentPage: 0 }) }
    console.log(that.data.currentPage)
    // 初始化数据库
    const db = wx.cloud.database();
    if (that.data.zhou == "diyizhou") { that.data.pagekey = 'diyizhouqiandao' }
    if (that.data.zhou == "dierzhou") { that.data.pagekey = 'dierzhouqiandao' }
    if (that.data.zhou == "disanzhou") { that.data.pagekey = 'disanzhouqiandao' }
    if (that.data.zhou == "disizhou") { that.data.pagekey = 'disizhouqiandao' }
    db.collection(that.data.pagekey)
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
          qiandaoinfo: res.data,
          currentPage: that.data.currentPage
        })
      }
    })
    db.collection(that.data.pagekey).where({}).count({
      success: function (res) {
        console.log(res.total)
        that.setData({total:res.total})
      }
    })
  },

  changeceyanflag: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.ceyanflag[index]) {
      this.data.ceyanflag[index] = false;
    } else {
      this.data.ceyanflag[index] = true;
    }
    this.setData({
      ceyanflag: this.data.ceyanflag
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
      url: '../../pages/qiandaoliulan/qiandaoliulan?linshicurrentPage=' + that.data.linshicurrentPage+"&zhou="+that.data.zhou
    })}
  },
  ontapxiayiye: function () {
    var that = this
    that.data.linshicurrentPage = that.data.currentPage
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    wx.redirectTo({
      url: '../../pages/qiandaoliulan/qiandaoliulan?linshicurrentPage=' + that.data.linshicurrentPage + "&zhou=" + that.data.zhou
    })
  },
  ontapshangyiye: function () {
    var that = this
    that.data.linshicurrentPage = that.data.currentPage - 2;
    if (that.data.linshicurrentPage < 0) { that.data.linshicurrentPage = 0 }
    wx.redirectTo({
      url: '../../pages/qiandaoliulan/qiandaoliulan?linshicurrentPage=' + that.data.linshicurrentPage + "&zhou=" + that.data.zhou
    })
  },

})