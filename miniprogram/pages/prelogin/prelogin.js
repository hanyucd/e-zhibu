// pages/prelogin/prelogin.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged: true,
    isPress: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkLogged();
  },

  checkLogged: function () {
    var page = this;
    wx.getUserInfo({
      success: res => {
        page.setData({
          logged: true,
          //userInfo: res.userInfo,
        });
        page.checkUser();
      },
      fail: res => {
        page.setData({ logged: false });
      }
    })
  },

  onClickLoginBtn(e){
    var page = this;
    wx.showLoading({
      title: "验证登陆中",
      mask: true,
    });
    wx.setStorageSync("stid", e.detail.value.xh);
    wx.setStorageSync("identity", e.detail.value.sfzh)
    page.data.isPress = true;
  },

  checkUser(){
    var page = this;
    if (wx.getStorageSync("stid") == "" || wx.getStorageSync("identity") == ""){
      if (page.data.isPress){
        page.data.isPress = false;
        wx.hideLoading();
        wx.showModal({
          title: '登陆失败',
          content: '请先填写好学号或身份证号',
          showCancel: false
        });
      }
      page.setData({ logged: false });
      return;
    }
    db.collection('users').where({
      stid: wx.getStorageSync("stid"),
      identity: wx.getStorageSync("identity"),
    }).get().then(res => {
      wx.hideLoading();
      if (res.data.length == 0) {
        page.setData({ logged: false });
        wx.showModal({
          title: '登陆失败',
          content: '请检查学号与身份证是否匹配',
          showCancel: false
        });
      } else if (res.data.length == 1){
        let tempList = [];
        tempList.push({
          username: res.data[0].username,
          classname: res.data[0].classname,
          phonenumber: res.data[0].phonenumber,
          part_member: res.data[0].part_member,
          stid: wx.getStorageSync("stid")
        });
        if (res.data[0].admin) wx.setStorageSync("date_time_type", res.data[0].admin);
        wx.setStorageSync("userInfo", tempList);
        wx.setStorageSync("points", res.data[0].points);
        wx.setStorageSync("_id", res.data[0]._id);
        wx.redirectTo({
          url: '/pages/index/index',
        });
      }
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    })
  },

  onGetUserInfo: function (e) {
    var page = this;
    if (!e.detail.userInfo) {
      wx.hideLoading();
      wx.showModal({
        title: '授权失败',
        content: '请先允许小程序获得授权',
        showCancel: false
      });
    }else{
      page.checkUser();
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