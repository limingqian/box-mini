// miniprogram/pages/cloud/cloud.js

const db = wx.cloud.database() // 初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: []
  },

  insert: function () {
    // db.collection('user').add({
    //   data: {
    //     name: 'lmq',
    //     age: 18
    //   },
    //   success:res=>{
    //     console.log(res)
    //   },
    //   fail:err=>{
    //     console.log(err)
    //   }
    // })
    db.collection('user').add({
      data: {
        name: 'jxy',
        age: 17
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  update: function (params) {
    db.collection('user').doc('75c568195f3d127b001ac0a63b5b0725').update({
      data: {
        age: 21
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  find() {
    db.collection('user').where({
      name: 'lmq'
    }).get().then(res => {
      console.log(res)
    }).catch()
  },

  delete() {
    db.collection('user').doc('75c568195f3d127b001ac0a63b5b0725').remove()
  },

  async sum() {
    let a = await wx.cloud.callFunction({
      name: "sum",
      data: {
        a: 2,
        b: 4
      }
    })
    console.log(a)
  },

  async getOpenId() {
    let a = await wx.cloud.callFunction({
      name: "login"
    })
    console.log(a)
  },

  async batchDelete() {
    let a = await wx.cloud.callFunction({
      name: "batchDelete"
    })
    console.log(a)
  },

  async upload() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + ".png", // 上传至云端的路径
          filePath: tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            db.collection('image').add({
              data: {
                fileID: res.fileID
              }
            })
          },
          fail: console.error
        })
      }
    })
  },
  async getFile() {
    let a = await wx.cloud.callFunction({
      name: "login"
    })
    let b = await db.collection('image').where({
      _openid: a.result.openid
    }).get()
    this.setData({
      images: b.data
    })

    console.log(b)
  },

  async download(event) {
    wx.cloud.downloadFile({
      fileID: event.target.dataset.id, // 文件 ID
      success: res => {
        // 返回临时文件路径
        console.log(res.tempFilePath)
        // 保存图片到手机相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '已下载',
            })
          }
        })
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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