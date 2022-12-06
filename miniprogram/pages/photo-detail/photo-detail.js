// pages/group-show/group-show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    selected: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
    if(options.list && options.init){
      this.setData({
        selected: parseInt(options.init),
        list: JSON.parse(options.list),
      });
    }
  },

  toggleLeft(){
    var temp = this.data.selected;
    this.setData({ selected: temp <= 0 ? this.data.list.length-1 : temp -= 1 });
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
  },

  toggleRight(){
    var temp = this.data.selected;
    this.setData({ selected: temp >= this.data.list.length-1 ? 0 : temp += 1 });
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
  },

  imageLoad(e){
    wx.hideLoading();
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