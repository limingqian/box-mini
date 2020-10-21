// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    def_box: '',
    box_code: '',
    box_des: '',
    notEmpty: true,
    username: '111',
    showBox: false,
    showNew: false,
    showBind: false,
    box_id: '',
    actions: [],
  },

  // 绑定冰箱
  async bindBox() {
    // 调用云函数绑定冰箱
    let box = await wx.cloud.callFunction({
      name: "bindBox",
      data: {
        openid: getApp().globalData.openid,
        box_id: this.data.box_id
      }
    })

    if (box.result) {
      getApp().globalData.box_id = this.data.box_id
      wx.showToast({
        title: '冰箱绑定成功',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '冰箱绑定失败',
        icon: 'none',
        duration: 2000
      })
    }
    // 刷新冰箱列表
    let list = await this.getBoxDetailList()
    this.setData({
      showBind: false,
      actions: list.map(temp => {
        return {
          box_id: temp.box_id,
          name: temp.name,
          box_code: temp.box_code,
          box_des: temp.box_des,
          user_box_id: temp._id,
        }
      })
    })
  },
  // 打开绑定冰箱
  showBind() {
    this.setData({
      showBind: true
    })
  },
  // 关闭绑定冰箱
  closeBind() {
    this.setData({
      showBind: false
    })
  },

  // 打开冰箱选择框
  changeBox() {
    this.setData({
      showBox: true
    })
  },
  // 关闭选择冰箱
  onClose() {
    this.setData({
      showBox: false
    });
  },

  // 选择冰箱
  async onSelect(event) {
    this.setData({
      showBox: false,
      def_box: event.detail.name,
      box_code: event.detail.box_code,
      box_des: event.detail.box_des,
    })

    // 修改默认冰箱
    await wx.cloud.callFunction({
      name: "updateDefBox",
      data: {
        openid: getApp().globalData.openid,
        user_box_id: event.detail.user_box_id
      }
    })
    getApp().globalData.box_id = event.detail.box_id
  },

  // 打开新建冰箱
  newBox() {
    this.setData({
      showNew: true
    })
  },
  // 新增冰箱组件返回回调
  goBack() {
    this.setData({
      showNew: false
    })
  },
  // 新增冰箱组件成功回调
  async success(event) {
    // 刷新冰箱列表
    let list = await this.getBoxDetailList()
    this.setData({
      showNew: false,
      actions: list.map(temp => {
        return {
          box_id: temp.box_id,
          name: temp.name,
          box_code: temp.name,
          box_des: temp.box_des,
          user_box_id: temp._id,
        }
      })
    })
  },

  // 获取冰箱列表
  async getBoxDetailList() {
    let result = await wx.cloud.callFunction({
      name: "getBoxDetailByUserId",
      data: {
        openid: getApp().globalData.openid
      }
    })
    return result.result.list
  },

  // todo修改冰箱，感觉最好做在管理端
  // todo删除冰箱

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取冰箱列表
    let list = await this.getBoxDetailList()
    let def = list.filter(temp => {
      return temp.def === 1
    })
    this.setData({
      def_box: def[0].name,
      box_code: def[0].box_code,
      box_des: def[0].box_des,
      actions: list.map(temp => {
        return {
          box_id: temp.box_id,
          name: temp.name,
          box_code: temp.box_code,
          box_des: temp.box_des,
          user_box_id: temp._id,
        }
      })
    })
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