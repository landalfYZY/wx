var x1, y1;
var ctx = wx.createCanvasContext('canvas'), i = 0, j = 0;
var colorArray = '#000000';
const app = getApp()

Page({
  data: {
    cri: [
      { x: 10, w: 2 }, { x: 20, w: 4 }, { x: 30, w: 6 }, { x: 40, w: 8 }
    ],
    flag: 0,
    color: [
      "#000000", "#ffffff", "#ff9900", "#0099FF", "#00CC66", "#FF3333", "#6633CC"
    ],
    colorFlag: 0
  },
  touchStart(event) {
    x1 = event.touches[0].x;
    y1 = event.touches[0].y;
  },
  touchMove(event) {
    var x = event.touches[0].x;
    var y = event.touches[0].y;


    ctx.moveTo(x1, y1); // 设置路径起点坐标
    ctx.lineTo(x, y); // 绘制一条直线

    ctx.stroke();
    ctx.draw(true);


    x1 = x;
    y1 = y;
  },
  setWidth(e) {
    ctx.setLineWidth(this.data.cri[e.currentTarget.dataset.width].w);
    this.setData({
      flag: e.currentTarget.dataset.width
    })
  },
  clearSomeOne() {
    ctx.setStrokeStyle('#ffffff');
  },
  clear() {
    ctx.clearActions
  },
  onReady(e) {
    ctx.setLineWidth(this.data.cri[0].w); // 设置线宽
    ctx.setLineCap('round');
    ctx.setStrokeStyle('#000000');
  },
  changeColor(e) {
    ctx.setStrokeStyle(this.data.color[e.currentTarget.dataset.index]);
    this.setData({
      colorFlag: e.currentTarget.dataset.index
    })
  },
  submitCanvas() {
    wx.setStorageSync("bb", ctx)
  },
  onLoad: function () {

  },

})
