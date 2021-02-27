const app=getApp();
const db = wx.cloud.database();
var key,tongzhiid,title,neirong,content,sec;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key,
    tongzhiid,
    title,neirong:"",content,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    images: [],
    sec:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.jugdeUserLogin();
    that.setData({key:options.key})
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection('tongzhi').where({
      tongzhikey:that.data.key
    }).get().then(res => {
      console.log(res.data);
      that.data.tongzhiid=res.data[0]._id
  })
  },
  gettitlecontent: function (event) {
    var that = this
    that.data.title = event.detail.value;
  },
  getneirongcontent: function (event) {
    var that = this
    that.data.neirong = event.detail.value;
  },

  /**
   * 选择图片
   */
  chooseImage: function (event) {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // 设置图片
        that.setData({
          images: res.tempFilePaths,
        })
        that.data.images = []
        console.log(res.tempFilePaths)
        for (var i in res.tempFilePaths) {
          wx.showToast({
            title: '智能检测中',
            icon: "none",
          })
          // 将图片上传至云存储空间
          wx.cloud.uploadFile({
            // 指定要上传的文件的小程序临时文件路径
            cloudPath: that.timetostr(new Date()),
            filePath: res.tempFilePaths[i],
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
        }
      },
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
        text: that.data.neirong
      }
    }).then((res) => {
      console.log("检测结果", res.result);
      if (!that.data.neirong) { this.saveDataToServer(); }
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
            minganxinxi: that.data.neirong
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
    var filename = "通知图片/"; 
    var str = filename + randnum + "_" + time.getMilliseconds() + ".png";
    return str;
  },

  /**
   * 发布
   */
  formSubmit: function (e) {
    var that = this
    console.log('图片：', that.data.images)

    //this.data.content = e.detail.value['input-content'];
    if (that.data.canIUse) {
      console.log(that.data.images,that.data.neirong)
      if (that.data.images.length > 0) {
        this.wenzijiance();
      } 
      else if (that.data.neirong.trim() != '') {
        this.wenzijiance();
      }
      else {
        wx.showToast({
          icon: 'none',
          title: '请等候图片处理完成或请检查信息',
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
    if(that.data.sec){
    if (that.data.images.length > 0) {
      console.log(1)
      wx.cloud.callFunction({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          jihe: "tongzhi",
          id: that.data.tongzhiid,
          mingcheng: 'tongzhi',
          photopath: that.data.images,
          biaoti: that.data.title,
          neirong: that.data.neirong,
        },
        success: function (res) {
          console.log("更新成功", res)
          that.data.title = "";
          that.data.neirong = "";
          that.data.images = [];

          that.setData({
            textContent: '',
            images: [],
          })
          that.showTipAndSwitchTab();
        },
        fail: console.error
      })}
    else if (that.data.neirong.trim() != '') {
      console.log(2)
      wx.cloud.callFunction({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          jihe: "tongzhi",
          id: that.data.tongzhiid,
          mingcheng: 'tongzhi1',
          biaoti: that.data.title,
          neirong: that.data.neirong,
        },
        success: function (res) {
          console.log("更新成功", res)
          that.data.title = "";
          that.data.neirong = "";
          that.data.images = [];

          that.setData({
            textContent: '',
            images: [],
          })
          that.showTipAndSwitchTab();
        },
        fail: console.error
      })
    }
    
    }
    else{
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
    wx.showToast({
      title: '发布成功',
    })
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
    this.data.images.splice(position, 1);
    // 渲染图片
    this.setData({
      images: this.data.images,
    })
  },
  // 预览图片
  previewImg: function (e) {
    var that = this
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示图片
      current: this.data.images[index],
      //所有图片
      urls: this.data.images
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