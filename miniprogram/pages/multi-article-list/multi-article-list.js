// pages/article-list/article-list.js
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    readCount: 0,
    noMoreData: false,
    isType2load: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    /**
     * nav === type
     * Articles - Type
     * 0:默认(指定ID显示) 20:党建专题 21:学习十九大 22:党章党史 23:专题教育 24:最新时事
     * 25:线上学习 26:政策法规 27:文件下发 28:线上测试
     * 
     * gNav 
     * 1:党建专题[type:20/21]
     * 2:学习十九大[type:22~28]
     */
    if (options.nav && options.gNav) {
      if (options.gNav == '1') {
        page.loadArticles('20');
        page.loadArticles('21');
      }
      if (options.gNav == '2') {
        page.loadArticles('22');
        page.loadArticles('23');
        page.loadArticles('24');
        page.loadArticles('25');
        page.loadArticles('26');
        page.loadArticles('27');
        page.loadArticles('28');
      }
      //if (options.nav == "2") page.loadArticles("1");
    }
  },

  onClickLoadMore: function () {
    this.loadArticles(this.data.filterType);
  },

  loadArticles(t) {
    var page = this;
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
    var tempWhere;
    tempWhere = db.collection('articles').where({
      type: t
    });
    tempWhere.orderBy('time', 'desc')
      .limit(3)
      .skip(page.data.readCount).field({
        _id: true,
        title: true,
        time: true,
        images: true,
        group: true,
        type: true
      }).get().then(res => {
        if (res.data.length == 0) {
          wx.hideLoading();
          return;
        }
        var tempList = page.data.list;
        var subList = {};
        res.data.forEach(item => {
          var localDate = new Date(item.time);
          var dateStr = "";
          dateStr += localDate.getFullYear() + "-";
          dateStr += localDate.getMonth() + 1 + "-";
          dateStr += localDate.getDate() + "";
          item.time = dateStr;
          subList.group = item.group;
          if (subList.childs == undefined) {
            subList.childs = [];
          }
          subList.childs.push(item);
        });
        tempList.push(subList);
        page.setData({
          readCount: page.data.readCount + 20,
          list: tempList,
        });
        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();
        console.error(err);
      });
  },

  showDetail(e) {
    var page = this;
    console.log(e);
    var tempUrl = '/pages/article-detail/article-detail?';
    tempUrl = tempUrl + 'aid=' + e.currentTarget.dataset.aid
    wx.navigateTo({
      url: tempUrl,
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