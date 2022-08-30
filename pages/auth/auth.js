// pages/auth/auth.js
import Toast from "@vant/weapp/toast/toast";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  getUserProfile(e) {
    var that = this;
    wx.getUserProfile({
      desc: "注册、登录小程序",
      success: (res) => {
        console.log("res: ", res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
      fail(err) {
        console.log("err: ", err);
      },
    });
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
  getPhoneNumber(e) {
    console.log(e);
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
      // 用户拒绝授权
      // 拒绝授权弹出提示，比如‘必须要授权手机号才能进行下一步操作’
      // 这里模拟授权成功的场景
      Toast.success({
        message: "授权成功",
        duration: 2000,
        onClose: () => {
          // 关闭当前页并返回上一页
          wx.navigateBack();
        },
      });
    } else {
      // 登录到后台并获取token
      const app = getApp();
      app
        .login()
        .then(() => {
          // 登录成功
          Toast.success({
            message: "授权成功",
            duration: 2000,
            onClose: () => {
              // 关闭当前页并返回上一页
              wx.navigateBack()
            },
          });
        })
        .catch((err) => {
          // 登录失败
          Toast.fail({
            message: err || "授权失败！",
            duration: 2000,
          });
        });
    }
  },
});
