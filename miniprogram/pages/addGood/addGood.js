// miniprogram/pages/addGood/addGood.js
// const dayjs = require('dayjs')
import dayjs from 'dayjs'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showDate: false, // 日期弹框
    showType: false, // 分类弹框
    showLoading: false,
    name: "",
    saveDate: '',
    alertDate: '',
    typeArray: [],
    originTypeArray: [],
    currentType: {},
    instockDate: '',
    currentDate: new Date().getTime(),
    remark: "",
    fileList: [],
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  // 分类弹框
  showType() {
    this.setData({
      showType: true
    });
  },

  cancelType() {
    this.setData({
      showType: false
    });
  },

  confirmType(event) {
    this.setData({
      currentType: event.detail,
      showType: false
    })
  },
  // 日期弹框
  showDate() {
    this.setData({
      showDate: true
    });
  },

  cancelDate() {
    this.setData({
      showDate: false
    });
  },

  confirmDate() {
    this.setData({
      instockDate: dayjs(this.data.currentDate).format('YYYY-MM-DD'),
      showDate: false
    })
  },

  // 选定日期
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },

  // 图片临时上传之后
  afterRead(event) {
    const {
      file
    } = event.detail;
    const {
      fileList
    } = this.data;
    fileList.push({
      url: file.path,
      deletable: true
    });
    this.setData({
      fileList
    });
  },

  // 删除图片
  delete() {
    this.setData({
      fileList: []
    })
  },

  // 新建good
  async doInsert() {
    let {
      name,
      saveDate,
      alertDate,
      originTypeArray,
      currentType,
      instockDate,
      remark,
      fileList
    } = this.data
    let fileID = ""
    // 参数校验
    if (name === "" || saveDate === "" || instockDate === "" || JSON.stringify(currentType) === "{}") {
      wx.showToast({
        title: '信息错误请重新提交',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      showLoading: true
    })
    // 得到type_id
    let type_id = originTypeArray[currentType.index]._id
    if (fileList.length > 0) {
      // 上传图片 wx.cloud.uploadFile 存 res.fileID
      let fileResult = await wx.cloud.uploadFile({
        cloudPath: new Date().getTime() + ".png", // 上传至云端的路径
        filePath: fileList[0].url, // 小程序临时文件路径
      })
      fileID = fileResult.fileID
    }

    let result = await wx.cloud.callFunction({
      name: "insertGood",
      data: {
        box_id: this.data.box_id,
        fileID,
        in_stock: instockDate,
        name,
        remark,
        save_date: parseInt(saveDate),
        alert_date: parseInt(alertDate),
        type_id,
        _openid: getApp().globalData.openid
      }
    })
    if (result) {
      // loading 并提示成功
      this.setData({
        showLoading: false
      })
      wx.showToast({
        title: '新增成功',
        icon: 'none',
        duration: 2000,
        success: () => {
          getApp().globalData.dif_good = 1
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      box_id: options.box_id
    })

    // 获取全部分类
    let result = await wx.cloud.callFunction({
      name: "listType"
    })
    this.setData({
      typeArray: result.result.data.map(temp => {
        return temp.name
      }),
      originTypeArray: result.result.data
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