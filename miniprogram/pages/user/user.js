// pages/user/user.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu_user_list: {},
    userInfo: [],
    avatarUrl: null,
    isAdmin: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);

    this.checkLogged();

    this.setData({
      menu_user_list: wx.getStorageSync('mainInfo').menu_user,
      userInfo: wx.getStorageSync('userInfo')[0],
      isAdmin: wx.getStorageSync('date_time_type'),
    });
  },

  checkLogged: function () {
    var page = this;
    wx.getUserInfo({
      success: res => {
        page.setData({
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
      fail: res => {
        page.logout();
      }
    })
  },

  onClickLogout(){
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗?',
      success: function (res) {
        if (res.confirm) {
          this.logout();
        }
      }
    })
  },

  logout: function(){
    wx.removeStorageSync('stid');
    wx.removeStorageSync('identity');
    wx.removeStorageSync('date_time_type');
    wx.removeStorageSync("points");
    wx.removeStorageSync("_id");
    wx.redirectTo({
      url: '/pages/prelogin/prelogin',
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