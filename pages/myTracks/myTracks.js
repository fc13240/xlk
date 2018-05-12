// pages/myTracks/myTracks.js
var http = require('../../utils/httpHelper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footPrint : [], //我的足迹列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getFootPrint();
  },
  /**
   * 查询我的足迹 - 20180111 - LQ
   */
  getFootPrint:function()
  {
    var that = this;
    http.httpPost('footprint',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      that.setData({
        footPrint: res.data.history
      });
    });
  },

  /**
   * 清空我的足迹 - 20180112 - LQ
   */
  cleadMyTracks:function(){
    var that = this;
    http.httpPost('delPrint',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      if(res.code == 200){
        that.setData({
          footPrint : []
        });
        wx.showModal({
          content: res.data.message,
          showCancel: false
        })
      }else{
        wx.showModal({
          content: res.error,
          showCancel: false
        })
      }
    });
  }
})