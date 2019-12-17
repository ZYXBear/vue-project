function Scratchcard(config) {
  this.config = {
    // canvas元素
    canvas: null,
    // 直接全部刮开的百分比
    showAllPercent: 65,
    // 图片图层
    coverImg: null,
    // 纯色图层，如果图片图层值不为null，则纯色图层无效
    coverColor: '#696969',
    // 全部刮开回调
    doneCallback: null,
    // 擦除半径
    radius: 20,
    // 屏幕倍数
    pixelRatio: 1,
    // 展现全部的淡出效果时间（ms）
    fadeOut: 2000
  }
  Object.assign(this.config, config)

  this.canvas = this.config.canvas
  this.ctx = null
  this.offsetX = null
  this.offsetY = null
  // 是否在画布上处于按下状态
  this.isDown = false
  // 是否已完成刮刮卡
  this.done = false
  this._init()
}

Scratchcard.prototype = {
  constructor: Scratchcard,
  _init: function() {
    var that = this
    this.ctx = this.canvas.getContext('2d')
    this.offsetX = this.canvas.parentNode.offsetLeft
    this.offsetY = this.canvas.parentNode.offsetTop
    console.log(this.offsetX, this.offsetY)
    this._addEvent()
    if (this.config.coverImg) {
      // 如果设置的图片涂层
      var coverImg = new Image()
      coverImg.src = this.config.coverImg
      // 读取图像
      coverImg.onload = function() {
        // 绘制图像
        that.ctx.drawImage(coverImg, 0, 0)
        that.ctx.globalCompositeOperation = 'destination-out'
      }
    } else {
      // 如果没设置图片涂层，则使用纯色涂层
      this.ctx.fillStyle = this.config.coverColor
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.globalCompositeOperation = 'destination-out'
    }
  },
  // 添加事件
  _addEvent: function() {
    const flag = 'ontouchstart' in window
    const tapstart = flag ? 'touchstart' : 'mousedown'
    const tapend = flag ? 'touchend' : 'mouseup'
    const tapmove = flag ? 'touchmove' : 'mousemove'
    this.canvas.addEventListener(tapstart, this._eventDown.bind(this), { passive: false })
    this.canvas.addEventListener(tapend, this._eventUp.bind(this), { passive: false })
    this.canvas.addEventListener(tapmove, this._scratch.bind(this), { passive: false })
  },
  _eventDown: function(e) {
    e.preventDefault()
    this.isDown = true
  },
  _eventUp: function(e) {
    e.preventDefault()
    this.isDown = false
  },
  // 刮涂层
  _scratch: function(e) {
    e.preventDefault()
    console.log(e)
    var that = this
    if (!this.done && this.isDown) {
      if (e.changedTouches) {
        e = e.changedTouches[e.changedTouches.length - 1]
      }
      console.log('---', this._offset(this.canvas))
      const x = (e.clientX + this.canvas.parentNode.parentNode.scrollLeft || e.pageX) - this._offset(this.canvas).left || 0
      const y = (e.clientY + this.canvas.parentNode.parentNode.scrollTop || e.pageY) - this._offset(this.canvas).top || 0
      if (this.ctx) {
        this.ctx.beginPath()
        this.ctx.arc(x * that.config.pixelRatio, y * that.config.pixelRatio, that.config.radius * that.config.pixelRatio, 0, Math.PI * 2)
        this.ctx.fill()
      }
      if (this._getFilledPercentage() > this.config.showAllPercent) {
        this._scratchAll()
      }
    }
  },
  // 刮开全部涂层
  _scratchAll() {
    var that = this
    this.done = true

    if (this.config.fadeOut > 0) {
      // 先使用CSS opacity清除，再使用canvas清除
      this.canvas.style.transition = 'all ' + this.config.fadeOut / 1000 + 's linear'
      this.canvas.style.opacity = '0'
      setTimeout(function() {
        that._clear()
      }, this.config.fadeOut)
    } else {
      // 直接使用canvas清除
      that._clear()
    }
    // 执行回调函数
    this.config.doneCallback && this.config.doneCallback()
  },
  // 清除全部涂层
  _clear() {
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  },
  // 获取刮开区域百分比
  _getFilledPercentage: function() {
    var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    // 存储当前cavnas画布的全部像素点信息
    var pixels = imgData.data
    // 存储当前canvas画布的透明像素信息
    var transPixels = []
    // 遍历全部像素点信息
    for (var i = 0; i < pixels.length; i += 4) {
      // 把透明的像素点添加到transPixels里
      if (pixels[i + 3] < 128) {
        transPixels.push(pixels[i + 3])
      }
    }
    // 计算透明像素点的占比
    return (transPixels.length / (pixels.length / 4) * 100).toFixed(2)
  },
  /**
   * 我们写一个函数， 传入一个元素， 返回一个对象， 对象中包含left top值
   * 思路： 获取定位父元素， 再获取距离
   * 再获取定位父元素的定位父元素， 再获取距离
   * 再获取定位父元素的定位父元素的定位父元素，再获取距离，直到body  然后让距离累加。
   */
  _offset: function(dom) {
    // 定义信号量
    var isIE8 = false
    // 定义浏览器信息
    var str = window.navigator.userAgent
    // 检测浏览器
    isIE8 = str.indexOf('MSIE 8.0') !== -1
    // for (; dom != document.body; dom = offsetParent)

    // 定义对象
    var result = {
      left: dom.offsetLeft,
      top: dom.offsetTop
    }
    // 使用while循环
    while (dom !== document.body) {
      // 获取定位父元素
      dom = dom.offsetParent
      // 判定
      if (isIE8) {
        // 说明是IE8 不需要额外加上 外边框
        result.left += dom.offsetLeft
        result.top += dom.offsetTop
      } else {
        // 不是IE8 所以要加上边框的值
        result.left += dom.offsetLeft + dom.clientLeft
        result.top += dom.offsetTop + dom.clientTop
      }
    }
    // 返回对象
    return result
  }
}

export default Scratchcard
