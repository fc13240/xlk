
const app = getApp();
var http = require('../../utils/httpHelper.js');
var login = require('../../utils/login.js');
wx.showShareMenu({
  withShareTicket: true
})
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    userAcer:0, //用户元宝数
  },

  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: '登录中...',
      mask: true,
    })

    login.dologin(function(res){
      that.setData({
        userInfo: res
      })
      wx.hideLoading();
      //获取元宝数
      http.httpPost('member_acer', { member_id: wx.getStorageSync('member_id') }, function (res) {
        that.setData({
          userAcer: res.data.member_acer
        });
      });
    })
},

onShareAppMessage: function (res) {
  return {
    title: '洞悉微客',
    path: 'pages/index/index',
    success: function (res) {
      // 转发成功
      wx.showModal({
        content: '转发成功',
        showCancel: false,
      })
    }
  }
},

onShow: function(){
  var that = this;
  //获取元宝数
  http.httpPost('member_acer', { member_id: wx.getStorageSync('member_id') }, function (res) {
    if (res.data.member_acer != null){
      that.setData({
        userAcer: res.data.member_acer
      });
    }
  });
},
toOrderList:function(e){
  var type = e.currentTarget.dataset.type
  wx.navigateTo({
    url: '../orderList/orderList?type='+type,
  })
},
  toAddressList:function(e){
    wx.navigateTo({
      url: '../addressList/addressList',
    })
  },
  toMyTracks:function(e){
    wx.navigateTo({
      url: '../myTracks/myTracks',
    })
  },
  toExchangeList:function(e){
    wx.navigateTo({
      url: '../exchangeList/exchangeList',
    })
  },
  toSign:function(e){
    wx.navigateTo({
      url: '../sign/sign',
    })
  },
  toInfoCenter:function(e){
    wx.navigateTo({
      url: '../infoCenter/infoCenter',
    })
  },
  toFeedback:function(e){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  toShareList:function(e){
    wx.navigateTo({
      url: '../shareList/shareList',
    })
  }

})