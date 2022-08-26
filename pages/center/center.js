// pages/center/center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuth: false,
    services: [{icon: 'shop-o', title: '附近门店'}, {icon: 'service-o', title: '在线客服'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
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
    // 获取本地登录 token
    const token = wx.getStorageSync('auth_token')
    this.setData({isAuth: !!token})
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
  openAuthPage() {
    wx.navigateTo({
      url: '../auth/auth',
    })
  },
  checkIsAuth() {
    // 检查是否有token，否则跳转到授权页
    return new Promise((resolve, reject) => {
      try {
        const token = wx.getStorageSync('auth_token')
        if(token){
          resolve(token)
        }else{
          throw new Error('未找到本地 token')
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  goToShop() {
    // 前往附近门店
    this.checkIsAuth().then((success) => {
      wx.navigateTo({
        url: '../shop/shop',
      })
    }, () => {
      this.openAuthPage()
    })
  }
})