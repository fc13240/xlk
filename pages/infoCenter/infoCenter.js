// pages/infoCenter/infoCenter.js
var http = require('../../utils/httpHelper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:[], //消息列表 - LQ
    showMessage:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //查询消息列表
    that.getMessageList();
  },

  /**
   * 查询消息列表 - 20180112 - LQ
   */
  getMessageList:function(){
    var that = this;
    http.httpPost('getmessage',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      that.setData({
        messageList: res.data.message_list
      });
    });
  },

  /**
   * 清空消息 - 20180112 - LQ
   */
  clearMessage:function(){
    var that = this;
    http.httpPost('delMessage',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      if(res.code == 200){
        that.setData({
          messageList : []
        });
        wx.showModal({
          content: '操作成功',
          showCancel: false,
        })
      }else{
        wx.showModal({
          content: res.error,
          showCancel: false,
        })
      }
    })
  }
})