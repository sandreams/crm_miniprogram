// index.js
Page({
  onLoad() {
    const app = getApp();
    app.login().then(
      () => {
        // 登录成功
        console.log("登陆成功！");
      },
      () => {
        // 登录失败
        console.log("登陆失败！");
      }
    );
  },
});
