// pages/editAddress/editAddress.js
var http = require('../../utils/httpHelper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo:{}, //地址详细信息 - LQ
    addressArray:[],
    addressId : '', //地址id
  },
  onLoad:function(options){
    var that = this;
    if (options.id > 0){
      http.httpGet('updateAddress', { 
            address_id: options.id,
            member_id: wx.getStorageSync('member_id') 
          }, function (res) {
        that.setData({
          addressInfo: res.data.address_info,
          addressArray: res.data.address_info.address_array,
          addressId: options.id
        });
      });
    }
    
  },
  bindRegionChange: function (e) {
    this.setData({
      addressArray: e.detail.value
    })
  },

  formSubmit: function(e)
  {
    var that = this;
    var address_id = that.data.addressId;
    var person_name = e.detail.value.person_name;
    var address = e.detail.value.address;
    var province = e.detail.value.province[0] + ' ' + e.detail.value.province[1] + ' ' + e.detail.value.province[2];
    var telephone = e.detail.value.telephone;

    if (address_id > 0){
      var action = 'updateAddress';
    }else{
      var action = 'addAddress';
    }
    
    http.httpPost(action,{
      address_id : address_id,
      person_name : person_name,
      telephone : telephone,
      address : province,
      detail : address,
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      if (res.code == 200){
        wx.showModal({
          content: res.data.message,
          showCancel : false,
          success:function(result){
            if (result.confirm){
              wx.navigateTo({
                url: '../addressList/addressList',
              })
            }
          }
        })
      }
    });
  }
})