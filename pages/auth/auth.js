// pages/auth/auth.js
import Toast from "@vant/weapp/toast/toast";
import Dialog from "@vant/weapp/dialog/dialog";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: true,
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
    if (e.detail.errMsg.indexOf("user deny") >= 0) {
      // 用户拒绝授权
      // 拒绝授权弹出提示，比如‘必须要授权手机号才能进行下一步操作’
      Dialog.alert({
        title: "提示",
        message: "完成注册需要授权手机号",
      });
    } else if (e.detail.errMsg.indexOf('ok') >= 0) {
      // 登录到后台并获取token
      const app = getApp();
      wx.setStorageSync(
        "phone_code",
        JSON.stringify({
          code: e.detail.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        })
      );
      Toast.loading({
        duration: 0,
        message: "登录中...",
        forbidClick: true,
      });
      app
        .login()
        .then(() => {
          // 登录成功
          setTimeout(() => {
            Toast.success({
              message: "授权成功",
              duration: 2000,
              onClose: () => {
                // 关闭当前页并返回上一页
                wx.navigateBack();
              },
            });
          }, 500);
        })
        .catch((err) => {
          // 登录失败
          setTimeout(() => {
            Toast.fail({
              message: err || "授权失败！",
              duration: 2000,
            });
          }, 500);
        })
        .finally(() => {
          Toast.clear();
        });
    }
  },
});
