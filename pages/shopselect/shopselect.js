// pages/shopselect/shopselect.js
import Dialog from "@vant/weapp/dialog/dialog";
import Toast from "@vant/weapp/toast/toast";
import * as request from "../../utils/request";
const app = getApp();
const defaultShops = [
  { shop_id: 1, shop_name: "测试门店1", distance: 0.3 },
  { shop_id: 2, shop_name: "测试门店2", distance: 1.2 },
  { shop_id: 3, shop_name: "测试门店3", distance: 3.4 },
];
Page({
  data: {
    query: "",
    shops: [],
    showList: false,
  },
  onLoad() {},
  onShow() {
    this.init();
  },
  init() {
    const that = this;
    wx.getStorage({
      key: "auth_token",
      encrypt: false,
      success(res) {
        app
          .getUserInfo()
          .then(() => {
            that.loadItems();
          })
          .catch(() => {
            // 获取用户失败, 返回上一级
            Dialog.alert({
              title: "标题",
              message: "获取用户信息失败",
            }).then(() => {
              wx.navigateBack();
            });
          });
      },
      fail() {
        that.openAuthPage();
      },
    });
  },
  loadItems() {
    const that = this;
    const query = this.data.query;
    this.setData({
      showList: false,
    });
    Toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true,
      loadingType: "spinner",
    });
    request
      .get("/wxapp/user/getShopList", {
        data: {
          shop_name: query,
        },
      })
      .then((res) => {
        console.log("res: ", res);
        that.setData({
          shops: res.data.shops,
        });
      })
      .finally(() => {
        setTimeout(() => {
          Toast.clear();
          that.setData({
            showList: true,
          });
        }, 500);
      });
  },
  openAuthPage() {
    wx.navigateTo({
      url: "../auth/auth",
    });
  },
  onSelectShop(event) {
    const that = this;
    if (
      event.currentTarget &&
      event.currentTarget.dataset &&
      event.currentTarget.dataset.item
    ) {
      const item = event.currentTarget.dataset.item;
      app.bindShopBySelectedShop(item.shop_id).then(
        () => {
          // 绑定成功
          Toast.success({
            message: "绑定成功",
            duration: 1500,
            onClose: () => {
              // 返回上一级
              wx.navigateBack();
            },
          });
        },
        () => {
          // 绑定失败
          Toast.fail({
            message: "绑定失败",
            duration: 1500,
            onClose: () => {
              // reload
              that.init();
            },
          });
        }
      );
    }
  },
  onSearch() {
    this.loadItems();
  },
  onSearchInput(event) {
    this.setData({
      query: event.detail || "",
    });
  },
  onClear() {
    this.setData({
      query: "",
    });
    this.loadItems();
  },
});
