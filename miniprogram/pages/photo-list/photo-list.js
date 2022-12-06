// pages/photo-list/photo-list.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    filterType: "0",
    tipText: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * List - Type
     * 0:默认 1:委员亮相 2:学生党员
     */
    var page = this;
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
    if(options.type) {
      page.setData({ filterType: options.type });
    }
    
    switch(page.data.filterType){
      case "1":
        page.setData({ tipText: "委员亮相" });
        break;
      case "2":
        page.setData({ tipText: "学生党员" });
        break;
      case "3":
        page.setData({ tipText: "积极分子" });
        break;
    }
    db.collection('show_photo').where({
      type: page.data.filterType
    }).get().then(res => {
      console.log(res);
      page.setData({
        list: res.data,
      });
    }).catch(err => {
      console.error(err);
    });
  },

  imageLoad(e) {
    if(e.currentTarget.dataset.index == this.data.list.length - 1) wx.hideLoading();
  },

  showDetail(e){
    wx.navigateTo({
      url: '/pages/photo-detail/photo-detail?init=' + e.currentTarget.dataset.index + '&list=' + JSON.stringify(this.data.list),
    })
  },

  showBigDetail(e){
    var imgs = [];
    this.data.list.forEach(item => {
      imgs.push(item.image_url);
    });
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: imgs[index], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
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