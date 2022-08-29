// pages/shopselect/shopselect.js
import Dialog from "@vant/weapp/dialog/dialog";
import Toast from "@vant/weapp/toast/toast";
import * as request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetSettings: false,
    userInfo: null,
    isShop: false,
    isAuth: false,
    showList: false,
    shopList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp();
    const that = this;
    if (wx.canIUse("getSetting")) {
      this.setData({
        canIUseGetSettings: true,
      });
    }
    // 如果没登录则跳转到登录页
    app
      .checkIsAuth()
      .then((token) => {
        that.setData({
          isAuth: !!token,
        });
      })
      .catch(() => {
        // 未登录则前往登录
        wx.navigateTo({
          url: "../auth/auth",
        });
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initData();
    this.loadItems();
  },

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
  initData() {
    // 初始化加载数据
    // 如果选择授权地理位置会关联到最近一家门店，如果拒绝授权会弹出列表手动选择门店
    const that = this;
    if (that.data.showList) {
      return;
    }
    if (this.data.canIUseGetSettings) {
      wx.getSetting({
        withSubscriptions: false,
        success(res) {
          console.log("setting: ", res.authSetting);
          const authSetting = res.authSetting;
          // 未授权过会询问
          if (authSetting["scope.userLocation"] === undefined) {
            console.log("开始请求位置信息");
            that.openLocationSetting();
          } else if (authSetting["scope.userLocation"] === false) {
            // 如果之前拒绝授权过会弹出提示
            Dialog.confirm({
              title: "请求授权当前位置",
              message: "需要获取您的地理位置，请确认授权",
              cancelButtonText: "暂不",
            })
              .then(() => {
                // 打开设置
                wx.openSetting({
                  withSubscriptions: false,
                });
              })
              .catch(() => {
                // 关闭授权窗口
              });
          }
        },
      });
    } else {
      this.openLocationSetting();
    }
  },
  loadItems() {
    const that = this;
    Promise.all([this.getUserInfo(), this.loadShopItems()]).then((res) => {
      that.setData({
        userInfo: res[0].data,
        shopList: res[1].data.shops,
      });
    });
  },
  openLocationSetting() {
    wx.getLocation({
      altitude: false,
      success(res) {
        console.log("res: ", res);
        request
          .post("自动关联门店接口")
          .then(() => {
            Toast.success("已自动关联门店");
          })
          .catch(() => {
            Toast.fail("自动关联门店错误");
          })
          .finally(() => {
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          });
      },
      fail() {
        Dialog.confirm({
          title: "请求授权当前位置",
          message: "需要获取您的地理位置，请确认授权",
        })
          .then(() => {
            // 打开设置
            wx.openSetting({
              withSubscriptions: false,
            });
          })
          .catch(() => {
            that.setData({
              showList: true,
            });
          });
      },
    });
  },
  async loadShopItems() {
    let items = [];
    items = await request.get("/wxapp/user/getShopList", {});
    return items;
  },
  async getUserInfo() {
    let userInfo = null;
    const app = getApp();
    userInfo = await app.getUserInfo();
    return userInfo;
  },
});
