// pages/shopselect/shopselect.js
import Dialog from '@vant/weapp/dialog/dialog';
// var request = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetSettings: false,
    userInfo: null,
    isShop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.canIUse('getSetting')) {
      this.setData({
        canIUseGetSettings: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var that = this
    if(this.data.canIUseGetSettings) {
      wx.getSetting({
        withSubscriptions: false,
        success(res) {
          console.log('setting: ', res.authSetting)
          const authSetting = res.authSetting
          // 未授权会询问
          if(!authSetting['scope.userLocation']) {
            console.log('开始请求位置信息')
            that.openLocationSetting()
          }
        }
      })
    }else {
      this.openLocationSetting()
    }
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  openLocationSetting() {
    wx.getLocation({
      altitude: false,
      success(res) {
        console.log('res: ', res)
      },
      fail(){
        Dialog.confirm({
          title: '请求授权当前位置',
          message: '需要获取您的地理位置，请确认授权'
        }).then(() => {
          // 打开设置
          wx.openSetting({
            withSubscriptions: false,
          })
        })
      }
    })
  },
  getUserInfo() {
    const app = getApp()
    const that = this
    app.getUserInfo().then((res) => {
      console.log('userinfo: ', res)
      if (res.data) {
        that.setData({userInfo: res.data})
      }
    })
  }
})