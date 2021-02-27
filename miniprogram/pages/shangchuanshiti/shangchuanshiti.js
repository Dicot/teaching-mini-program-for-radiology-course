const app = getApp()
var usershenfen;
var username;
Page({
  data: {
    username,
    usershenfen,
    selectedFlag: [],
  },
  onLoad: function () {
    var that = this;
    console.log(app.globalData.username, app.globalData.usershenfen)
    that.setData({ username: app.globalData.username, usershenfen: app.globalData.usershenfen })
  },
 









})
