// pages/feedback/feedback.js
var http = require('../../utils/httpHelper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'', //反馈内容 - LQ
    telephone:'', //手机号 - LQ
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   *  提交意见反馈 - 20180112 - LQ
   */
  formSubmit:function(e){
    var data = e.detail.value;
    var that = this;
    http.httpPost('feedback',{
        msg:data.msg,
        telephone:data.telephone,
        member_id: wx.getStorageSync('member_id') 
      },function(res){
      if(res.code == 200){
          that.setData({
            msg : '',
            telephone : ''
          });
          wx.showModal({
            content: '反馈成功',
            showCancel: false,
          })
      }else{
        wx.showModal({
          content: res.error,
          showCancel: false,
        })
      }
    });
  }
})