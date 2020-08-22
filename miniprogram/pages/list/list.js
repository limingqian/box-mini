// pages/list/list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    box_id: '',
    showInit: false,
    showNew: false,
    showLoading: false,
    hiddenEmpty: true,
    box_name: '',
    box_code: '',
    box_des: ''
  },
  newBox() {
    this.setData({
      showInit: false
    })
    this.setData({
      showNew: true
    })
  },
  async listGood() {
    let goods = []
    if (goods.length > 0) {

    } else {
      this.setData({
        hiddenEmpty: false
      })
    }
  },

  async insertBox() {
    // 创建冰箱
    this.setData({
      showNew: false,
      showLoading: true
    })
    // let box = await wx.cloud.callFunction({
    //   name: "insertBox",
    //   data: {
    //     openid: getApp().globalData.openid,
    //     box_name: this.data.box_name,
    //     box_code: this.data.box_code,
    //     box_des: this.data.box_des,
    //   }
    // })
    let box = 1
    this.setData({
      showLoading: false
    })
    // TODO 没有遇到失败的情况Em
    if (box) {
      wx.showTabBar()
      // 获取物品列表
      await this.listGood()
    } else {
      // 新增失败
    }
  },

  goBack() {
    this.setData({
      showNew: false
    })
    this.setData({
      showInit: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 隐藏tab以防乱点
    wx.hideTabBar();
    this.setData({
      showLoading: true
    })
    // 获取用户openid
    if (getApp().globalData.openid === '') {
      let user = await wx.cloud.callFunction({
        name: "login"
      })
      getApp().globalData.openid = user.result.openid
    }

    let openid = getApp().globalData.openid

    // 根据用户openid得到boxid列表
    let result = await wx.cloud.callFunction({
      name: "getBoxByUserId",
      data: {
        // 先测试找不到的情况
        openid: openid + 1
      }
    })
    this.setData({
      showLoading: false
    })
    if (result.result.data.length > 0) {
      // 选择冰箱
    } else {
      // 新建冰箱 弹框
      this.setData({
        showInit: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})