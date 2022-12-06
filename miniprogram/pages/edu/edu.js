// pages/edu/edu.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    edu_banner_list: {},
    grid_edu_list: {},
    study_list: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.pageOnLoad(this);

    this.setData({
      edu_banner_list: wx.getStorageSync('mainInfo').edu_banners,
      grid_edu_list: wx.getStorageSync('mainInfo').grid_edu,
      study_list: wx.getStorageSync('mainInfo').study_list,
    });

  },

  toMiniProgram: function (event) {

    wx.navigateToMiniProgram({
      appId: 'wxebadf544ddae62cb',
      path: 'pages/survey/index?sid=5609250&hash=e522',
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log('success');
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