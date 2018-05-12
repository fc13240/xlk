// pages/goodsDeatail/goodsDetail.js
var http = require('../../utils/httpHelper.js');
var login = require('../../utils/login.js');
const app = getApp();
wx.showShareMenu({
  withShareTicket: true
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:4,
     show:false,
     showAcer:true,
     showService:true,
     showJuan:true,
     goodsDetail:{}, // 商品详情 - LQ
     likeList:[], //猜你喜欢商品列表 - LQ
     command:'', //淘口令
     ewm:'', //客服二维码
     goodsType:'', //商品类型
  },

  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: that.data.goodsDetail.title,
      path: 'pages/goodsDetail/goodsDetail?id=' + that.data.goodsDetail.id +'&type='+that.data.goodsType,
      success: function (res) {
        // 转发成功
        wx.showModal({
          content: '转发成功',
          showCancel: false,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      show:false
    });
    that.getProductDetail(options);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //判断登录 - 20180108 - LQ
    var that = this;
    login.dologin(function (res) {
      that.setData({
        userInfo: res
      });
      app.globalData.userInfo = res;
    });
  },
  click:function(e){
    this.setData({
      show:!this.data.show
    })
  },
  toHome:function(e){
    wx.switchTab({
      url: '../index/index',
    })
  },
  service:function(){
    var that = this;
    http.httpPost('serviceEwm',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      that.setData({
        ewm : res.data.ewm
      });
      that.setData({
        showService: false
      })
      });
    
  },
  close:function(e){
    this.setData({
      showService: true
    })
  },
  showJuan:function(e){
    var that = this;
    var condition = {
      click_url: e.currentTarget.dataset.click_url,
      pict_url: e.currentTarget.dataset.pict_url,
      title: e.currentTarget.dataset.title,
      member_id: wx.getStorageSync('member_id') 
    };

    http.httpPost('command', condition,function(res){
      that.setData({
        command: res.data.command
      });
      that.setData({
        showJuan: false
      })
    });
  },
  closeJuan:function(e){
    this.setData({
      showJuan: true
    })
  },

  /**
   * 获取商品详情 - 20180112 - LQ
   */
  getProductDetail: function(options){
    var that = this;
    if (options.type){
      that.setData({
        goodsType: options.type
      });
    }
    http.httpPost('goodsDetail', { 
        goods_id: options.id, 
        type: options.type,
        member_id: wx.getStorageSync('member_id') 
      }, function (res) {
      that.setData({
        goodsDetail: res.data
      });
      //猜你喜欢商品列表 - 20180108 - LQ
      http.httpPost('relevance', { 
          id: that.data.goodsDetail.id,
          member_id: wx.getStorageSync('member_id') 
        }, function (res) {
        that.setData({
          likeList: res.data.goodsList
        });
      });
    });
  },

  toDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../goodsDetail/goodsDetail?id=" + id
    })
  },

  /**
   * 一键复制淘口令 - 20180115 - LQ
   */
  copyCommand: function(){
    var that = this;
    wx.setClipboardData({
      data: that.data.command,
      success: function (res) {
        wx.showModal({
          content: '复制成功,请打开淘宝购买商品',
          showCancel: false,
          success:function(result){
            if(result.confirm){
              that.setData({
                showJuan : true
              });
            }
          }
        })
      }
    })
  }
})