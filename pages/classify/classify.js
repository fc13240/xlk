// pages/classify/classify.js
var http = require('../../utils/httpHelper.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    limit:10,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    this.setData({
      cate_id:options.id
    })
    this.getGoods()
  },
  getGoods:function(){
    var that = this;
    http.httpPost('goodslist',{
        cate_id:this.data.cate_id,
        limit:that.data.limit,
        page:that.data.page,
        member_id: wx.getStorageSync('member_id') 
      },function(res){
        var goods = that.data.goods.concat(res.data.goodsList)
      that.setData({
        goods: goods
      });
      wx.hideLoading();
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
  onShow: function (options) {

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
    this.setData({
      goods: [],
      limit: 10,
      page: 1
    });
    this.getGoods()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var page = this.data.page + 1
    this.setData({
      page: page
    })
    this.getGoods()
  },
  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  toGoodsDetail: function (e) {
    wx.navigateTo({
      url: "../goodsDetail/goodsDetail?id=" + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type
    })
  }
})