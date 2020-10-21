// pages/list/list.js
import dayjs from 'dayjs'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    _id: '',
    box_id: '',
    showInit: false,
    showNew: false,
    showLoading: false,
    showList: false,
    emptyList: false,
    showDelete: false,
    active: "全部",
    box_name: '',
    box_code: '',
    box_des: '',
    errorMessage: '',
    typeArray: [],
    typeMap: {},
    list: [],
    originList: []
  },
  // 新建冰箱
  newBox() {
    this.setData({
      showInit: false
    })
    this.setData({
      showNew: true
    })
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
      wx.showToast({
        title: '冰箱绑定成功',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        showInit: false
      })
      wx.showTabBar()
      // 获取物品列表
      await this.listGood({
        _id: box.result
      })
    } else {
      wx.showToast({
        title: '冰箱绑定失败',
        icon: 'none',
        duration: 2000
      })
      return
    }
  },

  // 获取goods列表
  async listGood(params) {
    let now = dayjs().format('YYYY-MM-DD')
    let nowtimestamp = dayjs(now).unix()

    let {
      _id, // 冰箱_id
    } = params

    // 获取goods列表
    let goodArray = await wx.cloud.callFunction({
      name: "listGood",
      data: {
        box_id: _id
      }
    })

    let list = goodArray.result.list
    if (list.length > 0) {
      // 设置分类列表
      let typeArray = goodArray.result.typeArray
      // 构建map
      let map = {}
      for (let i = 0; i < typeArray.length; i++) {
        map[typeArray[i]._id] = typeArray[i].name
      }
      typeArray.unshift({
        _id: '1',
        name: '全部'
      })

      list = list.map(temp => {
        // 设置提醒标签
        let in_stock_timestamp = dayjs(temp.in_stock).unix()
        let pass_day = (nowtimestamp - in_stock_timestamp) / (60 * 60 * 24)
        temp.save_day = temp.save_date - pass_day

        if (!temp.alert_date) {
          temp.tag = "未设提醒" // 未设提醒
        } else if (pass_day > temp.save_date) {
          temp.tag = "已过期" // 已过期
        } else if ((temp.save_date - pass_day) >= temp.alert_date) {
          // 正常食用
          temp.tag = "正常食用"
        } else {
          temp.tag = "即将过期"
          temp.order = temp.save_date - pass_day // 从小到大排列
          // 即将过期
        }
        // 设置默认图片
        if (temp.fileID === "") {
          temp.fileID = "/images/food.png"
        }
        // 设置分类标签
        temp.type_tag = map[temp.type_id]
        return temp
      })

      list.sort((a, b) => {
        return a.order - b.order
      })
      
      this.setData({
        box_id: _id,
        typeArray,
        typeMap: map,
        list,
        originList: list,
        showList: true
      })
    } else {
      this.setData({
        showList: false
      })
    }
  },
  // 新增冰箱组件成功回调
  async success(event) {
    this.setData({
      showNew: false
    })
    wx.showTabBar()
    // 获取物品列表
    await this.listGood({
      _id: event.detail._id
    })
  },
  // 新增冰箱组件返回回调
  goBack() {
    this.setData({
      showNew: false
    })
    this.setData({
      showInit: true
    })
  },

  // 搜索物品
  async search(event) {
    // 定位到全部
    this.setData({
      active: "全部"
    })
    if (!event.detail) {
      // 重新获取数据
      await this.listGood({
        _id: this.data.box_id
      })
    } else {
      let originList = this.data.originList
      originList = originList.filter(temp => {
        let reg = new RegExp(event.detail, "g")
        return temp.name.match(reg) ? 1 : 0
      })
      this.setData({
        list: originList
      })
      if (originList.length === 0) {
        this.setData({
          showList: true
        })
      }
    }
  },

  // 点击标签
  clickTab(event) {
    let originList = this.data.originList
    if (event.detail.title === "全部") {
      this.setData({
        list: this.data.originList
      })
    } else {
      let typeMap = this.data.typeMap
      // 得到type_id
      let type_id = ""
      for (const key in typeMap) {
        if (typeMap[key] === event.detail.title) {
          type_id = key
          break;
        }
      }

      this.setData({
        list: originList.filter(temp => {
          return temp.type_id === type_id
        })
      })
    }
    if (this.data.list.length === 0) {
      this.setData({
        emptyList: true
      })
    } else {
      this.setData({
        emptyList: false
      })
    }
  },

  // 显示新增good弹窗
  insert() {
    wx.navigateTo({
      url: '/pages/addGood/addGood?box_id=' + this.data.box_id
    })
  },

  delete() {
    this.setData({
      showDelete: true
    })
  },

  async doDelete() {
    this.setData({
      showLoadingDelete: true
    })

    await wx.cloud.callFunction({
      name: "deleteGood",
      data: {
        _id: this.data._id
      }
    })
    let list = this.data.list
    for (let i = 0; i < list.length; i++) {
      if (list[i]._id === this.data._id) {
        list.splice(i, 1)
      }
    }

    let originList = this.data.originList
    for (let i = 0; i < originList.length; i++) {
      if (originList[i]._id === this.data._id) {
        originList.splice(i, 1)
      }
    }

    wx.showToast({
      title: '删除成功',
      icon: 'none',
      duration: 2000,
      success: () => {
        this.setData({
          showDelete: false,
          list,
          originList,
          active: "全部"
        })

      }
    })
  },

  cancel() {
    this.setData({
      showDelete: false
    })
  },

  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
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
        openid
      }
    })
    this.setData({
      showLoading: false
    })

    let boxList = result.result.data
    if (boxList.length > 0) {
      let defBox = boxList.filter(temp => {
        return temp.def === 1
      })
      // 全局的box
      getApp().globalData.box_id = defBox[0].box_id
      // 当前的box
      this.setData({
        box_id: defBox[0].box_id
      })

      wx.showTabBar()
      if (defBox.length > 0) {
        await this.listGood({
          _id: defBox[0].box_id
        })
      }
    } else {
      // 新建冰箱 弹框
      this.setData({
        showInit: true
      })
    }
  },
  // 跳转到详情页
  clickGood(event) {
    if (this.endTime - this.startTime < 350) {
      wx.navigateTo({
        url: '/pages/updateGood/updateGood?good=' + JSON.stringify(event.currentTarget.dataset.good)
      })
    } else {
      this.setData({
        _id: event.currentTarget.dataset.good._id
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
  onShow: async function () {
    // good有改变
    if (getApp().globalData.dif_good === 1) {
      await this.listGood({
        _id: getApp().globalData.box_id
      })
      getApp().globalData.dif_good = 0
      this.setData({
        active: "全部"
      })
      return
    }
    // box_id 不一样 刷新list
    if (this.data.box_id) {
      if (this.data.box_id != getApp().globalData.box_id) {
        this.setData({
          box_id: getApp().globalData.box_id
        })
        await this.listGood({
          _id: getApp().globalData.box_id
        })
      }
    }
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
  onPullDownRefresh: async function () {
    await this.listGood({
      _id: getApp().globalData.box_id
    })
    // 停止刷新
    wx.stopPullDownRefresh();
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