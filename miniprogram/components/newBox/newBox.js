// components/newBox/newBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showNew: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    errorMessage: '',
    loadingButton: false,
    box_name: '',
    box_code: '',
    box_des: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 新增冰箱
    async insertBox() {
      // 验证输入
      if (this.data.box_name === "" || this.data.box_code === "") {
        this.setData({
          errorMessage: '数据错误'
        })
        return
      }

      // 创建冰箱
      this.setData({
        errorMessage: '',
        loadingButton: true
      })

      let box = await wx.cloud.callFunction({
        name: "insertBox",
        data: {
          openid: getApp().globalData.openid,
          box_name: this.data.box_name,
          box_code: this.data.box_code,
          box_des: this.data.box_des
        }
      })

      // 按钮不可点击
      this.setData({
        loadingButton: false
      })
      if (!box.result) {
        wx.showToast({
          title: '冰箱码无效',
          icon: 'none',
          duration: 2000
        })
      } else {
        // 传递成功事件
        let success = {
          _id: box.result._id
        }
        this.triggerEvent('success', success)
      }
    },
    goBack() {
      this.triggerEvent('goBack')
    },
  }
})