 
const app = getApp();
const db = wx.cloud.database();
var usershenfen, usershenfenid;
var username, time, sec, content, jianbiezhenduan1, jianbiezhenduan2, jianbiezhenduan3, jianbiezhenduan4;
var util = require('../../modules/utils.js');
Page({
  data: {
    username,
    usershenfen,
    usershenfenid,
    time,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    images: [],
    zhusu:"",
    xianbingshi:"",
    jiwangshi:"",
    linchuangjiancha:"",
    yingxiangjiancha:"",
    zhenduan:"",
    isfocus:[],
    fileList: [],
    canvasHeight: 0,
    canvasWidth: 0,
    sec:true,
    content:"",
    jianbiezhenduan1, jianbiezhenduan2, jianbiezhenduan3, jianbiezhenduan4
  },
  onLoad: function () {
    var that = this
    console.log(app.globalData.username, app.globalData.usershenfen)
    that.setData({ username: app.globalData.username })
    that.setData({ usershenfen: app.globalData.usershenfen })
    that.setData({ usershenfenid: app.globalData.usershenfenid })
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
    that.jugdeUserLogin();
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
  },


  /**
   * 选择图片
   */
  chooseImage: function (event) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      //sourceType: ['camera'],
      //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var arr = that.data.fileList
        res.tempFilePaths.forEach(function (item) {
          arr.push(item)
        })
        that.setData({
          fileList: arr
        })
        console.log(that.data.fileList)
      for (var j = 0; j < that.data.fileList.length; j++) {console.log(j)}
        //获取图片详细信息
        wx.getImageInfo({
          src: that.data.fileList[0],
          success: (ress) => {
            var ctx = wx.createCanvasContext('firstCanvas')
            //真是宽高比例
            var ratio = ress.width / ress.height
            var viewWidth = 700;         //设置图片显示宽度
            var viewHeight = 700 / ratio;
            that.setData({
              canvasHeight: viewHeight,
              canvasWidth: viewWidth
            })
            console.log(that.data.canvasHeight, that.data.canvasWidth)
            //将图片src放到cancas内，宽高为图片大小
            ctx.drawImage(that.data.fileList[0], 0, 0, that.data.canvasWidth, that.data.canvasHeight)
            ctx.setFontSize(50) //注意：设置文字大小必须放在填充文字之前，否则不生效
            ctx.setFillStyle('#F8F8FF')
            ctx.setGlobalAlpha(0.3)
            var text = "@华西口腔放射科"
            ctx.fillText(text, (that.data.canvasWidth - ctx.measureText(text).width) / 2, that.data.canvasHeight / 2)
            setTimeout(function () {
              ctx.draw(false, function () {
                wx.canvasToTempFilePath({
                  canvasId: 'firstCanvas',
                  destWidth: that.data.canvasWidth,
                  destHeight: that.data.canvasHeight,
                  // width: that.data.canvasHeight,
                  //height: that.data.canvasWidth,
                  success: (res) => {
                    wx.showToast({
                      title: '智能检测中',
                      icon: "none",
                    })
                    // 将图片上传至云存储空间
                    wx.cloud.uploadFile({
                      // 指定要上传的文件的小程序临时文件路径
                      cloudPath: that.timetostr(new Date()),
                      filePath: res.tempFilePath,
                      // 成功回调
                      success: res => {

                        var tempres = res.fileID
                        wx.cloud.callFunction({
                          name: 'imgsec',
                          data: {
                            fileID: res.fileID
                          }
                        }).then(res => {
                          console.log("检测结果", res.result);
                          if (res.result.errCode == 0) {
                            that.data.images.push(tempres)
                            console.log("图片正常")
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
                                minganxinxi: tempres
                              }
                            })
                            wx.showToast({
                              icon: 'none',
                              title: '图片违规，后台已记录本次操作',
                              duration: 1500
                            })
                            that.data.sec = false
                          }
                          else if (!res.result) {
                            wx.showToast({
                              title: '图片检测失败请重试'
                            })
                          }
                        })
                      },
                    })
                    that.setData({
                      canvasHeight: 0,
                      canvasWidth: 0
                    })
                  },
                  fail: (e) => {
                    console.log(e)
                  }
                })
              })
            }, 500) //延迟时间 ms

          }
        })


      }
    })
  },

  wenzijiance: function () {
    var that = this
    wx.showToast({
      title: '智能检测中',
      icon: "none",
    })
    that.data.content = that.data.zhusu + that.data.xianbingshi + that.data.jiwangshi + that.data.linchuangjiancha + that.data.yingxiangjiancha + that.data.zhenduan + that.data.jianbiezhenduan1 + that.data.jianbiezhenduan2 + that.data.jianbiezhenduan3 + that.data.jianbiezhenduan4
    wx.cloud.callFunction({
      name: 'msgsec',
      data: {
        text: that.data.content
      }
    }).then((res) => {
      console.log("检测结果", res.result);
      if (!that.data.content) { this.saveDataToServer(); }
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
  /**
   * 图片路径格式化
   */

  timetostr(time) {
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var filename = "病例图片/"; 
    var str = filename + randnum + "_" + time.getMilliseconds() + ".png";
    return str;
  },

  /**
   * 发布 this.data.images.length > 0
   */
 submit: function (e) {
    var that = this
    console.log('图片：', that.data.images)
    if (that.data.canIUse) {
      if (that.data.images.length==that.data.fileList.length) {
       that.wenzijiance()
      } 
       else {
        wx.showToast({
          icon: 'none',
          title: '请等候图片处理完成或请检查内容',
        })
      }
    } else {
      that.jugdeUserLogin();
    }
  },
  /**
   * 保存到发布集合中
   */
  saveDataToServer: function (event) {
    var that = this
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var jihemingcheng = "binglijianbie_" + randnum
    console.log(randnum)
    console.log(that.data.images)
if(that.data.sec){
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection('dianxingbingli').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        zhusu:that.data.zhusu,
        xianbingshi:that.data.xianbingshi,
        jiwangshi:that.data.jiwangshi,
        linchuangjiancha:that.data.linchuangjiancha,
        yingxiangjiancha:that.data.yingxiangjiancha,
        zhenduan:that.data.zhenduan,
        time: parseInt(that.data.time),
        photopath: that.data.images,
        fabuname:that.data.username,
        jianbiezhenduan1: that.data.jianbiezhenduan1,
        jianbiezhenduan2: that.data.jianbiezhenduan2,
        jianbiezhenduan3: that.data.jianbiezhenduan3,
        jianbiezhenduan4: that.data.jianbiezhenduan4,
        jianbiezhenduanjihe: jihemingcheng,
        binglihidden:true
      },
      success: function (res) {
        // 保存到发布历史
            console.log(jihemingcheng)
            wx.cloud.callFunction({
              // 云函数名称
              name: 'creatcollection',
              // 传给云函数的参数
              data: {
                mingcheng: jihemingcheng,
              },
              success: function (res) {
                console.log("更新成功", res)
              },
              fail: console.error
            })
      
          // 清空数据
        
        that.data.images = [];

        that.setData({
         
          images: [],
          fileList:[]
        })
        wx.showToast({
          title: '上传成功',
          icon:"none"
        })
        that.showTipAndSwitchTab();
      },
    })
}else{
  wx.showToast({
    title: '请退出重试',
    icon: "none"
  })
}
  },
  /**
   * 添加成功添加提示，切换页面
   */
  showTipAndSwitchTab: function (event) {
    wx.redirectTo({
      url: '../../pages/jiaoshijiaoxuejiemian/jiaoshijiaoxuejiemian',
    })
  },
  /**
   * 删除图片
   */
  removeImg: function (event) {
    var that = this
    var position = event.currentTarget.dataset.index;
    that.data.images.splice(position, 1);
    that.data.fileList.splice(position, 1)
    // 渲染图片
    that.setData({
      images: that.data.images,
      fileList: that.data.fileList
    })
  },
  // 预览图片
  previewImg: function (e) {
    var that = this
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示图片
      current: this.data.fileList[index],
      //所有图片
      urls: this.data.fileList
    })
  },



  /**
   * 判断用户是否登录
   */
  jugdeUserLogin: function (event) {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {

              that.data.user = res.userInfo;
              console.log(that.data.user)
            }
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  zhusuinput:function(e){
    var that=this
    var focusnow = 'isfocus[' + 0 + ']'
    that.setData({ focusnow: true })
    that.setData({zhusu:e.detail.value})
  },
  xianbingshiinput: function (e) {
    var that = this
    var focusnow = 'isfocus[' + 1 + ']'
    that.setData({ focusnow: true })
    that.setData({ xianbingshi: e.detail.value })
  },
  jiwangshiinput: function (e) {
    var that = this
    var focusnow = 'isfocus[' + 2 + ']'
    that.setData({ focusnow: true })
    that.setData({ jiwangshi: e.detail.value })
  },
 linchuangjianchainput: function (e) {
    var that = this
    var focusnow = 'isfocus[' + 3 + ']'
    that.setData({ focusnow: true })
    that.setData({ linchuangjiancha: e.detail.value })
  },
 yingxiangjianchainput: function (e) {
    var that = this
    var focusnow = 'isfocus[' + 4 + ']'
    that.setData({ focusnow: true })
    that.setData({ yingxiangjiancha: e.detail.value })
  },
 zhenduaninput: function (e) {
    var that = this
    var focusnow = 'isfocus[' + 5 + ']'
    that.setData({ focusnow: true })
    that.setData({zhenduan: e.detail.value })
  },
  jianbiezhenduan1input: function (e) {
    var that = this
    var focusnow = 'isfocus[' + 6 + ']'
    that.setData({ focusnow: true })
    that.setData({ jianbiezhenduan1: e.detail.value })
  },
  jianbiezhenduan2input: function (e) {
    var that = this
    var focusnow = 'isfocus[' + 7 + ']'
    that.setData({ focusnow: true })
    that.setData({ jianbiezhenduan2: e.detail.value })
  },
  jianbiezhenduan3input: function (e) {
    var that = this
    var focusnow = 'isfocus[' + 8 + ']'
    that.setData({ focusnow: true })
    that.setData({ jianbiezhenduan3: e.detail.value })
  },
  jianbiezhenduan4input: function (e) {
    var that = this
    var focusnow = 'isfocus[' + 9 + ']'
    that.setData({ focusnow: true })
    that.setData({ jianbiezhenduan4: e.detail.value })
  },







})