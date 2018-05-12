// pages/addressList/addressList.js
var http = require('../../utils/httpHelper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      checked:false,
      addressList:[], //地址列表 - LQ
      chooseShow: false,
      product_id: '', //商品id - LQ
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取地址列表 - 20180109 - LQ
    that.getAddressList();
    if (options.type == 'choose'){
      that.setData({
        chooseShow : true
      });
    }
    that.setData({
      product_id : options.id
    });
  },
  toEdit:function(e){
    var address_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../editAddress/editAddress?id='+address_id,
    })
  },

  //删除地址
  delAddress:function(e)
  {
    var that = this;
    var address_id = e.currentTarget.dataset.id
    http.httpPost('delAddress',{
        address_id:address_id,
        member_id: wx.getStorageSync('member_id') 
      },function(res){
      if(res.code == 200){
        that.getAddressList();
        var title = '删除成功';
      }else{
        var title = '删除失败';
      }
      wx.showModal({
        content: title,
        showCancel:false
      })
    });
  },

  //查询地址列表 - 20180109 - LQ
  getAddressList:function(){
    var that = this;
    http.httpPost('address_list', {
      member_id: wx.getStorageSync('member_id') 
    }, function (res) {
      var addressList = res.data.address_list;
      that.setData({
        addressList: addressList
      });
    });
  },

  //添加地址 - 20180111 - LQ
  toAddress:function(){
    wx.navigateTo({
      url: '../editAddress/editAddress',
    })
  },

  /**
   * 选择收货地址 - 20180112 - LQ
   */
  chooseAddress:function(e)
  {
    var that = this;
    var address_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../exchange/exchange?address_id=' + address_id + '&id=' + that.data.product_id,
    })
  },

  /**
   * 设为默认地址 - 20180112 - LQ
   */
  setDefault: function(e){
    var that = this;
    var address_id = e.currentTarget.dataset.id;
    http.httpGet('setDefaultAddress',{
        address_id:address_id,
        member_id: wx.getStorageSync('member_id') 
      },function(res){
      if(res.code == 200){
        wx.showModal({
          content: '设置成功',
          showCancel: false,
        })
        that.getAddressList();
      }else{
        wx.showModal({
          content: res.error,
          showCancel: false,
        })
      }
    });
  }
})