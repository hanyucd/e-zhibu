// pages/show/show.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_show_list: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.pageOnLoad(this);

    //group_show 列表偶化
    var temp_list = wx.getStorageSync('mainInfo').group_show;
    temp_list.forEach(item => {
      if(item.list.length % 2 != 0){
        item.list.push({
          image_url: '',
          text: ''
        });
      }
    });

    this.setData({
      group_show_list: temp_list,
    });

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