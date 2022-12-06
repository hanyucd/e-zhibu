// pages/article-list/article-list.js
const db = wx.cloud.database();
const _ = db.command;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        filterType: 0,
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
         * 0:默认(指定ID显示) 1:支部生活+红色掠影 2:支部生活特定 3:党务公开 4:公告 5:党规党章 6:邮件 7:全部邮件(仅可用于管理员查看邮件时)
         * 8:每日一习语 9:每月一党课 10:最新时事 11:典型榜样 12:身边榜样
         */
        if (options.nav) {
            page.data.filterType = options.nav;
            page.loadArticles(options.nav);
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
        if (t != "6" && t != "7") {
            tempWhere = db.collection('articles').where({
                type: t == "2" ? _.or(_.eq("1"), _.eq("2")) : t
            });
        } else if (t == "6") {
            tempWhere = db.collection('letters').where({
                user_id: wx.getStorageSync("_id")
            });
        } else if (t == "7") {
            tempWhere = db.collection('letters');
        }
        tempWhere.orderBy('time', 'desc')
            .skip(page.data.readCount).field({
                _id: true,
                title: true,
                time: true,
                images: true
            }).get().then(res => {
                if (res.data.length == 0) {
                    wx.hideLoading();
                    page.setData({ noMoreData: true });
                    return;
                }
                var tempList = page.data.list;
                res.data.forEach(item => {
                    var localDate = new Date(item.time);
                    var dateStr = "";
                    dateStr += localDate.getFullYear() + "-";
                    dateStr += localDate.getMonth()+1 + "-";
                    dateStr += localDate.getDate() + "";
                    item.time = dateStr;
                    tempList.push(item);
                });
                page.setData({
                    readCount: page.data.readCount + 20,
                    list: tempList
                });
                wx.hideLoading();
            }).catch(err => {
                wx.hideLoading();
                console.error(err);
            });
    },

    showDetail(e) {
        var page = this;
        var tempUrl = '/pages/article-detail/article-detail?';
        if (page.data.filterType != "6" && page.data.filterType != "7") {
            tempUrl = tempUrl + 'aid=' + page.data.list[e.currentTarget.dataset.index]._id
        } else {
            tempUrl = tempUrl + 'lid=' + page.data.list[e.currentTarget.dataset.index]._id
        }
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