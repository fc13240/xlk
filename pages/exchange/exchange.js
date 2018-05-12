// pages/exchange/exchange.js
var http = require('../../utils/httpHelper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:1,
    productInfo:{}, //商品信息 - LQ
    defaultAddress:{}, //默认地址 - LQ
    telShow: true, //填写手机号
    aliShow:true, //填写支付宝
    addressShow:true, //收货地址显示
    productId:'', //商品id

  },
  reduce:function(){
    if(this.data.num<=0){
        return
    }else{
      var num = this.data.num - 1
      this.setData({
        num: num
      })
    }
   
  },
  add:function(){
    var num = this.data.num + 1
    this.setData({
      num:num
    })
  },
  toAddressList:function(e){
    wx.navigateTo({
      url: '../addressList/addressList?type=choose&id='+e.currentTarget.dataset.id,
    })
  },
  onLoad:function(options){
    var that = this;
    // 查询商品信息
    that.getProductInfo(options);
  },

  /**
   * 查询商品信息 - 20180112 - LQ
   */
  getProductInfo:function(options)
  {
    var that = this;
    http.httpPost('exchangeinfo',{
       product_id:options.id,
       member_id: wx.getStorageSync('member_id') 
      },function(res){
      var product_info = res.data.product_info;
      if(res.code == 200){
        if (product_info.product_type == 2){
          that.setData({
            aliShow : true,
            telShow : true,
            addressShow : false
          });
        } else if (product_info.product_type == 1 && product_info.type == 1){
          that.setData({
            aliShow: true,
            telShow: false,
            addressShow: true
          });
        } else if (product_info.product_type == 1 && product_info.type == 2){
          that.setData({
            aliShow: false,
            telShow: true,
            addressShow: true
          });
        }
        that.setData({
          productInfo: product_info,
          productId: product_info.product_id
        });

        if(options.address_id != '' && options.address_id != null){
          that.getAddressInfo(options.address_id);
        }else{
          that.setData({
            defaultAddress: res.data.default_address,
          });
        }
      }else{
        wx.showModal({
          content: res.error,
          showCancel: false,
          complete: function(result) {
            if(result.confirm){
              wx.navigateTo({
                url: '../acerstore/acerstore',
              })
            }
          },
        })
      }
    });
  },

  /**
   * 查询地址信息 - 20180112 - LQ
   */
  getAddressInfo: function(address_id)
  {
    var that = this;
    http.httpGet('updateAddress',{
        address_id:address_id,
        member_id: wx.getStorageSync('member_id') 
      },function(res){
      var addressInfo = res.data.address_info;
      var addressData = {
        address_id: address_id,
        province: addressInfo.address_array[0],
        country: addressInfo.address_array[1],
        district: addressInfo.address_array[2],
        address: addressInfo.address,
        person_name: addressInfo.person_name,
        telephone: addressInfo.telephone
      };
      that.setData({
        defaultAddress: addressData
      });
    });
  },

  /**
   * 执行兑换 - 20180112 - LQ
   */
  formSubmit: function(e){
    var data = e.detail.value;
    var exchange_number = data.exchange_number;
    var product_id = this.data.productId;
    var telephone = data.telephone;
    var alipay = data.alipay;
    var address_id = data.address_id;

    http.httpPost('exchange',{
      number : exchange_number,
      product_id : product_id,
      telephone: telephone,
      alipay: alipay,
      address_id: address_id,
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      if(res.code == 200){
        wx.showModal({
          content: res.data.message,
          showCancel: false,
          success: function(result) {
            if(result.confirm){
              wx.navigateTo({
                url: '../acerstore/acerstore',
              })
            }
          },
        })
      }else{
        wx.showModal({
          content: res.error,
          showCancel: false,
          success: function (result) {
            if (result.confirm) {
              wx.navigateTo({
                url: '../acerstore/acerstore',
              })
            }
          },
        })
      }
    });
  }
})