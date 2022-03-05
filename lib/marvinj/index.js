/* eslint-disable */
const { createMatrix2D, createMatrix3D } = require('./marvinJSUtils')
const { euclideanDistance, scaleMatrix } = require('./marvinMath')
const { Image, createCanvas } = require('canvas')
const COLOR_MODEL_RGB = 0
const COLOR_MODEL_BINARY = 1
class MarvinColorModelConverter {
  constructor() {}
  rgbToBinary(img, threshold) {
    var resultImage = new MarvinImage(img.getWidth(), img.getHeight(), COLOR_MODEL_BINARY)
    for (var y = 0; y < img.getHeight(); y++) {
      for (var x = 0; x < img.getWidth(); x++) {
        var gray = Math.ceil(
          img.getIntComponent0(x, y) * 0.3 +
            img.getIntComponent1(x, y) * 0.59 +
            img.getIntComponent2(x, y) * 0.11,
        )
        if (gray <= threshold) {
          resultImage.setBinaryColor(x, y, true)
        } else {
          resultImage.setBinaryColor(x, y, false)
        }
      }
    }
    return resultImage
  }
  binaryToRgb(img) {
    var resultImage = new MarvinImage(img.getWidth(), img.getHeight(), COLOR_MODEL_RGB)
    for (var y = 0; y < img.getHeight(); y++) {
      for (var x = 0; x < img.getWidth(); x++) {
        if (img.getBinaryColor(x, y)) {
          resultImage.setIntColor(x, y, 255, 0, 0, 0)
        } else {
          resultImage.setIntColor(x, y, 255, 255, 255, 255)
        }
      }
    }
    return resultImage
  }
  rgbToHsv(rgbArray) {
    var hsvArray = new Array(rgbArray.length * 3)
    var red, green, blue
    for (var i = 0; i < rgbArray.length; i++) {
      red = (rgbArray[i] & 0xff0000) >>> 16
      green = (rgbArray[i] & 0x00ff00) >>> 8
      blue = rgbArray[i] & 0x0000ff
      red /= 255.0
      green /= 255.0
      blue /= 255.0
      var max = Math.max(Math.max(red, green), blue)
      var min = Math.min(Math.min(red, green), blue)
      var c = max - min
      // H
      var h, s, v
      if (c != 0) {
        if (max == red) {
          if (green >= blue) {
            h = 60 * ((green - blue) / c)
          } else {
            h = 60 * ((green - blue) / c) + 360
          }
        } else if (max == green) {
          h = 60 * ((blue - red) / c) + 120
        } else {
          h = 60 * ((red - green) / c) + 240
        }
      } else {
        h = 0
      }
      // V
      v = max
      // S
      s = c != 0 ? c / v : 0
      hsvArray[i * 3] = h
      hsvArray[i * 3 + 1] = s
      hsvArray[i * 3 + 2] = v
    }
    return hsvArray
  }
  hsvToRgb(hsvArray) {
    var rgbArray = new Array(hsvArray.length / 3)
    for (var i = 0, j = 0; i < hsvArray.length; i += 3, j++) {
      var h = hsvArray[i]
      var s = hsvArray[i + 1]
      var v = hsvArray[i + 2]
      // HSV to RGB
      var hi = Math.ceil((h / 60) % 6)
      var f = h / 60 - hi
      var p = v * (1 - s)
      var q = v * (1 - f * s)
      var t = v * (1 - (1 - f) * s)
      var iHi = Math.ceil(hi)
      var r = 0,
        g = 0,
        b = 0
      switch (iHi) {
        case 0:
          r = Math.ceil(v * 255)
          g = Math.ceil(t * 255)
          b = Math.ceil(p * 255)
          break
        case 1:
          r = Math.ceil(q * 255)
          g = Math.ceil(v * 255)
          b = Math.ceil(p * 255)
          break
        case 2:
          r = Math.ceil(p * 255)
          g = Math.ceil(v * 255)
          b = Math.ceil(t * 255)
          break
        case 3:
          r = Math.ceil(p * 255)
          g = Math.ceil(q * 255)
          b = Math.ceil(v * 255)
          break
        case 4:
          r = Math.ceil(t * 255)
          g = Math.ceil(p * 255)
          b = Math.ceil(v * 255)
          break
        case 5:
          r = Math.ceil(v * 255)
          g = Math.ceil(p * 255)
          b = Math.ceil(q * 255)
          break
      }
      rgbArray[j] = 0xff000000 + (r << 16) + (g << 8) + b
    }
    return rgbArray
  }
}
class MarvinImage {
  constructor(width = -1, height = -1, colorModel) {
    // properties
    this.image = null
    this.canvas = null
    this.ctx = undefined
    this.data = new Uint8ClampedArray()
    this.width = 0
    this.height = 0
    if (colorModel == null) {
      this.colorModel = COLOR_MODEL_RGB
    } else {
      this.colorModel = colorModel
    }
    if (width >= 0 && height >= 0) {
      this.create(width, height)
    }
    if (colorModel == COLOR_MODEL_BINARY && width != undefined && height != undefined) {
      this.arrBinaryColor = new Array(width * height)
    }
  }
  create(width, height) {
    this.data = new Uint8ClampedArray(width * height * 4)
    this.width = width
    this.height = height
  }
  getWidth() {
    return this.width
  }
  getHeight() {
    return this.height
  }
  getColorModel() {
    return this.colorModel
  }
  setDimension(width, height) {
    this.create(width, height)
  }
  load(url, callback) {
    this.onload = callback
    this.image = new Image()
    var ref = this
    this.image.onload = function () {
      ref.callbackImageLoaded(ref)
    }
    this.image.crossOrigin = 'anonymous'
    this.image.src = url
  }
  callbackImageLoaded(marvinImage) {
    marvinImage.width = marvinImage.image.width
    marvinImage.height = marvinImage.image.height
    marvinImage.canvas = createCanvas(marvinImage.image.width, marvinImage.image.height)
    marvinImage.ctx = marvinImage.canvas.getContext('2d')
    if (marvinImage.ctx == undefined) return
    marvinImage.ctx.drawImage(marvinImage.image, 0, 0)
    this.data = marvinImage.ctx.getImageData(
      0,
      0,
      marvinImage.width,
      marvinImage.height,
    ).data
    if (marvinImage.onload != null) {
      marvinImage.onload()
    }
  }
  clone() {
    var image = new MarvinImage(this.width, this.height, this.colorModel)
    this.copyColorArray(image)
    return image
  }
  loadImageData() {
    const imageData = new ImageData(this.width, this.height)
    for (let i = 0; i < this.width * this.height * 4; i++) {
      imageData.data[i] = this.data[i]
    }
    return imageData
  }
  update() {
    this.canvas.getContext('2d').putImageData(this.loadImageData(), 0, 0)
  }
  clear(color) {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        this.setIntColor(x, y, color)
      }
    }
  }
  getAlphaComponent(x, y) {
    var start = (y * this.width + x) * 4
    return this.data[start + 3]
  }
  setAlphaComponent(x, y, alpha) {
    var start = (y * this.width + x) * 4
    this.data[start + 3] = alpha
  }
  getIntComponent0(x, y) {
    var start = (y * this.width + x) * 4
    return this.data[start]
  }
  getIntComponent1(x, y) {
    var start = (y * this.width + x) * 4
    return this.data[start + 1]
  }
  getIntComponent2(x, y) {
    var start = (y * this.width + x) * 4
    return this.data[start + 2]
  }
  setIntColor(x, y, a1, a2, a3, a4) {
    if (a2 == null) {
      this.setIntColor1(x, y, a1)
    } else if (a3 == null && a4 == null) {
      this.setIntColor2(x, y, a1, a2)
    } else if (a4 == null) {
      this.setIntColor3(x, y, a1, a2, a3)
    } else {
      this.setIntColor4(x, y, a1, a2, a3, a4)
    }
  }
  getIntColor(x, y) {
    var start = (y * this.width + x) * 4
    return (
      0x100000000 +
      (this.data[start + 3] << 24) +
      (this.data[start] << 16) +
      (this.data[start + 1] << 8) +
      this.data[start + 2]
    )
  }
  setIntColor1(x, y, color) {
    var a = (color & 0xff000000) >>> 24
    var r = (color & 0x00ff0000) >> 16
    var g = (color & 0x0000ff00) >> 8
    var b = color & 0x000000ff
    this.setIntColor4(x, y, a, r, g, b)
  }
  setBinaryColor(x, y, value) {
    var pos = y * this.width + x
    this.arrBinaryColor[pos] = value
  }
  getBinaryColor(x, y) {
    var pos = y * this.width + x
    return this.arrBinaryColor[pos]
  }
  copyColorArray(imgDestine) {
    if (this.colorModel == imgDestine.colorModel) {
      switch (this.colorModel) {
        case COLOR_MODEL_RGB:
          for (var i = 0; i < this.data.length; i++) {
            imgDestine.data[i] = this.data[i]
          }
          break
        case COLOR_MODEL_BINARY:
          for (var i = 0; i < this.arrBinaryColor.length; i++) {
            imgDestine.arrBinaryColor[i] = this.arrBinaryColor[i]
          }
          break
      }
    }
  }
  drawRect(x, y, width, height, color) {
    for (var i = x; i < x + width; i++) {
      this.setIntColor(i, y, color)
      this.setIntColor(i, y + (height - 1), color)
    }
    for (var i = y; i < y + height; i++) {
      this.setIntColor(x, i, color)
      this.setIntColor(x + (width - 1), i, color)
    }
  }
  fillRect(x, y, width, height, color) {
    for (var i = x; i < x + width; i++) {
      for (var j = y; j < y + height; j++) {
        if (i < this.width && j < this.width) {
          this.setIntColor(i, j, color)
        }
      }
    }
  }
  setColorToAlpha(color, alpha) {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        if ((this.getIntColor(x, y) & 0x00ffffff) == (color & 0x00ffffff)) {
          this.setAlphaComponent(x, y, alpha)
        }
      }
    }
  }
  setAlphaToColor(color) {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        if (this.getAlphaComponent(x, y) == 0) {
          this.setIntColor(x, y, 0xffffffff)
        }
      }
    }
  }
  setIntColor2(x, y, alpha, color) {
    var r = (color & 0x00ff0000) >> 16
    var g = (color & 0x0000ff00) >> 8
    var b = color & 0x000000ff
    this.setIntColor4(x, y, alpha, r, g, b)
  }
  setIntColor3(x, y, r, g, b) {
    this.setIntColor4(x, y, 255, r, g, b)
  }
  setIntColor4(x, y, alpha, r, g, b) {
    var start = (y * this.width + x) * 4
    this.data[start] = r
    this.data[start + 1] = g
    this.data[start + 2] = b
    this.data[start + 3] = alpha
  }
  isValidPosition(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return true
    }
    return false
  }
  draw(canvas, x, y, alphaCombination) {
    if (x == null) {
      x = 0
    }
    if (y == null) {
      y = 0
    }
    const context = canvas.getContext('2d')
    if (context == undefined) return
    context.putImageData(this.loadImageData(), x, y) /*
        if(alphaCombination == null || !alphaCombination){
            canvas.getContext("2d").putImageData(this.imageData, x,y);
        } else{
            this.imageData = this.ctx.getImageData(0, 0, width, height);
            var c = document.createElement('canvas');
            c.width = this.width;
            c.height = this.height;
            c.getContext('2d').putImageData(this.imageData,x,y);
            var img = new Image();
            img.src = c.toDataURL();
            canvas.getContext("2d").drawImage(img, x, y);
        }*/
  }
  toBlob() {
    this.update()
    return this.dataURItoBlob(this.canvas.toDataURL('image/png'))
  }
  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1])
    else byteString = unescape(dataURI.split(',')[1])
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length)
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ia], { type: mimeString })
  }
}
class MarvinImageMask {
  constructor(w, h) {
    this.width = w
    this.height = h
    if (w != 0 && h != 0) {
      this.arrMask = createMatrix2D(w, h)
    } else {
      this.arrMask = undefined
    }
  }
  getWidth() {
    return this.width
  }
  getHeight() {
    return this.height
  }
  addPixel(x, y) {
    if (this.arrMask == undefined) return
    this.arrMask[x][y] = true
  }
  removePixel(x, y) {
    if (this.arrMask == undefined) return
    this.arrMask[x][y] = false
  }
  clear() {
    if (this.arrMask != null) {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          this.arrMask[x][y] = false
        }
      }
    }
  }
  getMask() {
    return this.arrMask
  }
  addRectRegion(startX, startY, regionWidth, regionHeight) {
    if (this.arrMask == undefined) return
    for (var x = startX; x < startX + regionWidth; x++) {
      for (var y = startY; y < startY + regionHeight; y++) {
        this.arrMask[x][y] = true
      }
    }
  }
}
const NULL_MASK = new MarvinImageMask(0, 0)
class MarvinSegment {
  constructor(x1, y1, x2, y2) {
    this.width = -1
    this.height = -1
    this.area = -1
    this.x1 = x1
    this.x2 = x2
    this.y1 = y1
    this.y2 = y2
    if (x1 != -1 && y1 != -1 && x2 != -1 && y2 != -1) {
      this.width = x2 - x1 + 1
      this.height = y2 - y1 + 1
      this.area = this.width * this.height
    }
  }
  segmentMinDistance(segments, minDistance) {
    var s1, s2
    for (var i = 0; i < segments.length - 1; i++) {
      for (var j = i + 1; j < segments.length; j++) {
        s1 = segments[i]
        s2 = segments[j]
        if (
          euclideanDistance(
            (s1.x1 + s1.x2) / 2,
            (s1.y1 + s1.y2) / 2,
            (s2.x1 + s2.x2) / 2,
            (s2.y1 + s2.y2) / 2,
          ) < minDistance
        ) {
          segments.splice(j, 1)
          j--
        }
      }
    }
  }
}
class MarvinColor {
  constructor(red, green, blue) {
    this.name = ''
    this.red = red
    this.green = green
    this.blue = blue
  }
  setId(id) {
    this.id = id
  }
  getId() {
    return this.id
  }
  setName(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}
class MarvinAbstractImagePlugin {
  constructor() {
    this.attributes = {}
  }
  setAttribute(label, value) {
    this.attributes[label] = value
  }
  getAttribute(label) {
    return this.attributes[label]
  }
}
class DetermineSceneBackground extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('threshold', 30)
  }
  process(images, imageOut) {
    var threshold = this.getAttribute('threshold')
    var image0 = images[0]
    for (var y = 0; y < image0.getHeight(); y++) {
      for (var x = 0; x < image0.getWidth(); x++) {
        imageOut.setIntColor(x, y, this.getBackgroundPixel(x, y, images, threshold))
      }
    }
  }
  getBackgroundPixel(x, y, images, threshold) {
    var colors = new Array()
    for (let i in images) {
      var img = images[i]
      var c = new Array(4)
      c[0] = img.getIntComponent0(x, y)
      c[1] = img.getIntComponent1(x, y)
      c[2] = img.getIntComponent2(x, y)
      c[3] = 0
      if (colors.length == 0) {
        colors.push(c)
      } else {
        var found = false
        for (var j in colors) {
          var c2 = colors[j]
          if (
            Math.abs(c2[0] - c[0]) < threshold * 0.3 &&
            Math.abs(c2[1] - c[1]) < threshold * 0.3 &&
            Math.abs(c2[2] - c[2]) < threshold * 0.3
          ) {
            c2[0] = Math.floor((c2[0] + c[0]) / 2)
            c2[1] = Math.floor((c2[1] + c[1]) / 2)
            c2[2] = Math.floor((c2[2] + c[2]) / 2)
            c2[3]++
            found = true
            break
          }
        }
        if (!found) {
          colors.push(c)
        }
      }
    }
    var max = -1
    var maxIndex = 0
    var c2 = null
    for (let i = 0; i < colors.length; i++) {
      c2 = colors[i]
      if (max == -1 || c2[3] > max) {
        max = c2[3]
        maxIndex = i
      }
    }
    c2 = colors[maxIndex]
    return 0xff000000 + (c2[0] << 16) + (c2[1] << 8) + c2[2]
  }
}
class GaussianBlur extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.RED = 0
    this.GREEN = 1
    this.BLUE = 2
    this.kernelMatrix = null
    this.resultMatrix = null
    this.appiledkernelMatrix = null
    this.radius = null
    this.setAttribute('radius', 3)
  }
  process(imageIn, imageOut, mask) {
    this.radius = this.getAttribute('radius')
    var l_imageWidth = imageIn.getWidth()
    var l_imageHeight = imageIn.getHeight()
    var l_pixelColor
    this.kernelMatrix = this.getGaussianKernel()
    this.resultMatrix = createMatrix3D(l_imageWidth, l_imageHeight, 3, 0)
    this.appiledkernelMatrix = createMatrix2D(l_imageWidth, l_imageHeight, 0)
    var l_arrMask = mask.getMask()
    for (var x = 0; x < l_imageWidth; x++) {
      for (var y = 0; y < l_imageHeight; y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue
        }
        l_pixelColor = imageIn.getIntColor(x, y)
        this.applyKernel(x, y, l_pixelColor, imageOut)
      }
    }
    for (var x = 0; x < l_imageWidth; x++) {
      for (var y = 0; y < l_imageHeight; y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue
        }
        this.resultMatrix[x][y][this.RED] =
          (this.resultMatrix[x][y][0] / this.appiledkernelMatrix[x][y]) % 256
        this.resultMatrix[x][y][this.GREEN] =
          (this.resultMatrix[x][y][1] / this.appiledkernelMatrix[x][y]) % 256
        this.resultMatrix[x][y][this.BLUE] =
          (this.resultMatrix[x][y][2] / this.appiledkernelMatrix[x][y]) % 256
        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          Math.floor(this.resultMatrix[x][y][0]),
          Math.floor(this.resultMatrix[x][y][1]),
          Math.floor(this.resultMatrix[x][y][2]),
        )
      }
    }
  }
  /*
   * Calc Gaussian Matrix.
   */
  getGaussianKernel() {
    var l_matrix = createMatrix2D(this.radius * 2 + 1, this.radius * 2 + 1)
    var l_q = this.radius / 3.0
    var l_distance
    var l_x
    var l_y
    for (var x = 1; x <= this.radius * 2 + 1; x++) {
      for (var y = 1; y <= this.radius * 2 + 1; y++) {
        l_x = Math.abs(x - (this.radius + 1))
        l_y = Math.abs(y - (this.radius + 1))
        l_distance = Math.sqrt(l_x * l_x + l_y * l_y)
        l_matrix[y - 1][x - 1] =
          (1.0 / (2.0 * Math.PI * l_q * l_q)) *
          Math.exp(-(l_distance * l_distance) / (2.0 * l_q * l_q))
      }
    }
    return l_matrix
  }
  /*
   * Apply the blur matrix on a image region.
   */
  applyKernel(centerPixel_X, centerPixel_Y, pixelColor, image) {
    for (var y = centerPixel_Y; y < centerPixel_Y + this.radius * 2; y++) {
      for (var x = centerPixel_X; x < centerPixel_X + this.radius * 2; x++) {
        if (
          x - this.radius >= 0 &&
          x - this.radius < image.getWidth() &&
          y - this.radius >= 0 &&
          y - this.radius < image.getHeight()
        ) {
          this.resultMatrix[x - this.radius][y - this.radius][this.RED] +=
            ((pixelColor & 0x00ff0000) >>> 16) *
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y]
          this.resultMatrix[x - this.radius][y - this.radius][this.GREEN] +=
            ((pixelColor & 0x0000ff00) >>> 8) *
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y]
          this.resultMatrix[x - this.radius][y - this.radius][this.BLUE] +=
            (pixelColor & 0x000000ff) *
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y]
          this.appiledkernelMatrix[x - this.radius][y - this.radius] +=
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y]
        }
      }
    }
  }
}
class AlphaBoundary extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('radius', 5)
  }
  process(imageIn, imageOut) {
    var neighborhood = this.getAttribute('radius')
    for (var y = 0; y < imageOut.getHeight(); y++) {
      for (var x = 0; x < imageOut.getWidth(); x++) {
        this.alphaRadius(imageOut, x, y, neighborhood)
      }
    }
  }
  alphaRadius(image, x, y, radius) {
    var oldAlpha = image.getAlphaComponent(x, y)
    var newAlpha
    var totalAlpha = 0
    var totalPixels = 0
    var hn = Math.floor(radius / 2)
    for (var j = y - hn; j < y + hn; j++) {
      for (var i = x - hn; i < x + hn; i++) {
        if (i >= 0 && i < image.getWidth() && j >= 0 && j < image.getHeight()) {
          totalAlpha += image.getAlphaComponent(i, j)
          totalPixels++
        }
      }
    }
    newAlpha = Math.floor(totalAlpha / totalPixels)
    if (newAlpha < oldAlpha) image.setAlphaComponent(x, y, newAlpha)
  }
}
class AverageColor extends MarvinAbstractImagePlugin {
  constructor() {
    super()
  }
  process(imageIn, attributesOut) {
    var totalR = 0
    var totalG = 0
    var totalB = 0
    for (var x = 0; x < imageIn.getWidth(); x++) {
      for (var y = 0; y < imageIn.getHeight(); y++) {
        totalR += imageIn.getIntComponent0(x, y)
        totalG += imageIn.getIntComponent1(x, y)
        totalB += imageIn.getIntComponent2(x, y)
      }
    }
    var totalPixels = imageIn.getWidth() * imageIn.getHeight()
    totalR = Math.round(totalR / totalPixels)
    totalG = Math.round(totalG / totalPixels)
    totalB = Math.round(totalB / totalPixels)
    if (attributesOut != null) {
      attributesOut.set('averageColor', [totalR, totalG, totalB])
    }
  }
}
class BlackAndWhite extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.MAX_RLEVEL = 0.03
    this.grayScale = new GrayScale()
    this.setAttribute('level', 10)
  }
  process(imageIn, imageOut) {
    this.grayScale.process(imageIn, imageOut)
    var level = this.getAttribute('level')
    var rlevel = (level / 100.0) * this.MAX_RLEVEL
    var c = 0
    var gray
    for (var y = 0; y < imageOut.getHeight(); y++) {
      for (var x = 0; x < imageOut.getWidth(); x++) {
        gray = imageIn.getIntComponent0(x, y)
        if (gray <= 127) {
          gray = Math.max(gray * (1 - (127 - gray) * rlevel), 0)
        } else {
          gray = Math.min(gray * (1 + (gray - 127) * rlevel), 255)
        }
        if (c++ < 1) {
          console.log('gray:' + gray)
          console.log('level:' + level)
          console.log('rlevel:' + rlevel)
        }
        imageOut.setIntColor(
          x,
          y,
          255,
          Math.floor(gray),
          Math.floor(gray),
          Math.floor(gray),
        )
      }
    }
  }
}
class BrightnessAndContrast extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('brightness', 0)
    this.setAttribute('contrast', 0)
  }
  process(imageIn, imageOut) {
    var r, g, b
    var l_brightness = this.getAttribute('brightness')
    var l_contrast = this.getAttribute('contrast')
    l_contrast = Math.pow((127 + l_contrast) / 127, 2)
    // Brightness
    for (var x = 0; x < imageIn.getWidth(); x++) {
      for (var y = 0; y < imageIn.getHeight(); y++) {
        r = imageIn.getIntComponent0(x, y)
        g = imageIn.getIntComponent1(x, y)
        b = imageIn.getIntComponent2(x, y)
        r += (1 - r / 255) * l_brightness
        g += (1 - g / 255) * l_brightness
        b += (1 - b / 255) * l_brightness
        if (r < 0) r = 0
        if (r > 255) r = 255
        if (g < 0) g = 0
        if (g > 255) g = 255
        if (b < 0) b = 0
        if (b > 255) b = 255
        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          Math.floor(r),
          Math.floor(g),
          Math.floor(b),
        )
      }
    }
    // Contrast
    for (var x = 0; x < imageIn.getWidth(); x++) {
      for (var y = 0; y < imageIn.getHeight(); y++) {
        r = imageOut.getIntComponent0(x, y)
        g = imageOut.getIntComponent1(x, y)
        b = imageOut.getIntComponent2(x, y)
        r /= 255.0
        r -= 0.5
        r *= l_contrast
        r += 0.5
        r *= 255.0
        g /= 255.0
        g -= 0.5
        g *= l_contrast
        g += 0.5
        g *= 255.0
        b /= 255.0
        b -= 0.5
        b *= l_contrast
        b += 0.5
        b *= 255.0
        if (r < 0) r = 0
        if (r > 255) r = 255
        if (g < 0) g = 0
        if (g > 255) g = 255
        if (b < 0) b = 0
        if (b > 255) b = 255
        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          Math.floor(r),
          Math.floor(g),
          Math.floor(b),
        )
      }
    }
  }
}
class ColorChannel extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('red', 0)
    this.setAttribute('green', 0)
    this.setAttribute('blue', 0)
  }
  process(imageIn, imageOut) {
    var vr = this.getAttribute('red')
    var vg = this.getAttribute('green')
    var vb = this.getAttribute('blue')
    var mr = 1 + Math.abs((vr / 100.0) * 2.5)
    var mg = 1 + Math.abs((vg / 100.0) * 2.5)
    var mb = 1 + Math.abs((vb / 100.0) * 2.5)
    mr = vr > 0 ? mr : 1.0 / mr
    mg = vg > 0 ? mg : 1.0 / mg
    mb = vb > 0 ? mb : 1.0 / mb
    var red, green, blue
    for (var y = 0; y < imageIn.getHeight(); y++) {
      for (var x = 0; x < imageIn.getWidth(); x++) {
        red = imageIn.getIntComponent0(x, y)
        green = imageIn.getIntComponent1(x, y)
        blue = imageIn.getIntComponent2(x, y)
        red = Math.min(red * mr, 255)
        green = Math.min(green * mg, 255)
        blue = Math.min(blue * mb, 255)
        imageOut.setIntColor(x, y, 255, red, green, blue)
      }
    }
  }
}
class Emboss extends MarvinAbstractImagePlugin {
  constructor() {
    super()
  }
  process(imageIn, imageOut, mask) {
    var l_arrMask = mask.getMask()
    for (var x = 0; x < imageIn.getWidth(); x++) {
      for (var y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          imageOut.setIntColor(x, y, 255, imageIn.getIntColor(x, y))
          continue
        }
        var rDiff = 0
        var gDiff = 0
        var bDiff = 0
        if (y > 0 && x > 0) {
          // Red component difference between the current and the upperleft pixels
          rDiff = imageIn.getIntComponent0(x, y) - imageIn.getIntComponent0(x - 1, y - 1)
          // Green component difference between the current and the upperleft pixels
          gDiff = imageIn.getIntComponent1(x, y) - imageIn.getIntComponent1(x - 1, y - 1)
          // Blue component difference between the current and the upperleft pixels
          bDiff = imageIn.getIntComponent2(x, y) - imageIn.getIntComponent2(x - 1, y - 1)
        } else {
          rDiff = 0
          gDiff = 0
          bDiff = 0
        }
        var diff = rDiff
        if (Math.abs(gDiff) > Math.abs(diff)) diff = gDiff
        if (Math.abs(bDiff) > Math.abs(diff)) diff = bDiff
        var grayLevel = Math.max(Math.min(128 + diff, 255), 0)
        imageOut.setIntColor(x, y, 255, grayLevel, grayLevel, grayLevel)
      }
    }
  }
}
class GrayScale extends MarvinAbstractImagePlugin {
  constructor() {
    super()
  }
  process(imageIn, imageOut, mask) {
    // Mask
    var l_arrMask
    if (mask != null) {
      l_arrMask = mask.getMask()
    }
    var r, g, b, finalColor
    for (var x = 0; x < imageIn.getWidth(); x++) {
      for (var y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue
        }
        //Red - 30% / Green - 59% / Blue - 11%
        r = imageIn.getIntComponent0(x, y)
        g = imageIn.getIntComponent1(x, y)
        b = imageIn.getIntComponent2(x, y)
        finalColor = Math.ceil(r * 0.3 + g * 0.59 + b * 0.11)
        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          finalColor,
          finalColor,
          finalColor,
        )
      }
    }
  }
}
class Invert extends MarvinAbstractImagePlugin {
  constructor() {
    super()
  }
  process(imageIn, imageOut, mask) {
    var l_arrMask = mask.getMask()
    var r, g, b
    for (var x = 0; x < imageIn.getWidth(); x++) {
      for (var y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue
        }
        r = 255 - imageIn.getIntComponent0(x, y)
        g = 255 - imageIn.getIntComponent1(x, y)
        b = 255 - imageIn.getIntComponent2(x, y)
        imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), r, g, b)
      }
    }
  }
}
class Sepia extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('txtValue', '20')
    this.setAttribute('intensity', 20)
  }
  process(imageIn, imageOut, mask) {
    var r, g, b, depth, corfinal
    //Define a intensidade do filtro...
    depth = this.getAttribute('intensity')
    var width = imageIn.getWidth()
    var height = imageIn.getHeight()
    var l_arrMask = mask.getMask()
    for (var x = 0; x < imageIn.getWidth(); x++) {
      for (var y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue
        }
        //Captura o RGB do ponto...
        r = imageIn.getIntComponent0(x, y)
        g = imageIn.getIntComponent1(x, y)
        b = imageIn.getIntComponent2(x, y)
        //Define a cor como a média aritmética do pixel...
        corfinal = (r + g + b) / 3
        r = g = b = corfinal
        r = this.truncate(r + depth * 2)
        g = this.truncate(g + depth)
        //Define a nova cor do ponto...
        imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), r, g, b)
      }
    }
  }
  /**
   * Sets the RGB between 0 and 255
   * @param a
   * @return
   */
  truncate(a) {
    if (a < 0) return 0
    else if (a > 255) return 255
    else return a
  }
}
class Thresholding extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('threshold', 125)
    this.setAttribute('thresholdRange', -1)
    this.setAttribute('neighborhood', -1)
    this.setAttribute('range', -1)
    this.pluginGray = new GrayScale()
    this.threshold = null
    this.thresholdRange = null
    this.neighborhood = null
    this.range = null
  }
  process(imageIn, imageOut, mask) {
    this.threshold = this.getAttribute('threshold')
    this.thresholdRange = this.getAttribute('thresholdRange')
    this.neighborhood = this.getAttribute('neighborhood')
    this.range = this.getAttribute('range')
    if (this.thresholdRange == -1) {
      this.thresholdRange = 255 - this.threshold
    }
    this.pluginGray.process(imageIn, imageOut, mask)
    var bmask = mask.getMask()
    if (this.neighborhood == -1 && this.range == -1) {
      this.hardThreshold(imageIn, imageOut, bmask)
    } else {
      this.contrastThreshold(imageIn, imageOut)
    }
  }
  hardThreshold(imageIn, imageOut, mask) {
    for (var y = 0; y < imageIn.getHeight(); y++) {
      for (var x = 0; x < imageIn.getWidth(); x++) {
        if (mask != null && !mask[x][y]) {
          continue
        }
        let gray = imageIn.getIntComponent0(x, y)
        let value =
          255 *
          Number(!(gray < this.threshold || gray > this.threshold + this.thresholdRange))
        imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), value, value, value)
      }
    }
  }
  contrastThreshold(imageIn, imageOut) {
    this.range = 1
    for (var x = 0; x < imageIn.getWidth(); x++) {
      for (var y = 0; y < imageIn.getHeight(); y++) {
        if (this.checkNeighbors(x, y, this.neighborhood, this.neighborhood, imageIn)) {
          imageOut.setIntColor(x, y, 0, 0, 0)
        } else {
          imageOut.setIntColor(x, y, 255, 255, 255)
        }
      }
    }
  }
  checkNeighbors(x, y, neighborhoodX, neighborhoodY, img) {
    var color
    var z = 0
    color = img.getIntComponent0(x, y)
    for (var i = 0 - neighborhoodX; i <= neighborhoodX; i++) {
      for (var j = 0 - neighborhoodY; j <= neighborhoodY; j++) {
        if (i == 0 && j == 0) {
          continue
        }
        if (
          color < this.getSafeColor(x + i, y + j, img) - this.range &&
          this.getSafeColor(x + i, y + j, img) != -1
        ) {
          z++
        }
      }
    }
    if (z > neighborhoodX * neighborhoodY * 0.5) {
      return true
    }
    return false
  }
  getSafeColor(x, y, img) {
    if (x >= 0 && x < img.getWidth() && y >= 0 && y < img.getHeight()) {
      return img.getIntComponent0(x, y)
    }
    return -1
  }
}
class ThresholdingNeighborhood extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('neighborhoodSide', 10)
    this.setAttribute('samplingPixelDistance', 1)
    this.setAttribute('thresholdPercentageOfAverage', 1.0)
  }
  process(imageIn, imageOut) {
    var neighborhoodSide = this.getAttribute('neighborhoodSide')
    var samplingPixelDistance = this.getAttribute('samplingPixelDistance')
    var thresholdPercentageOfAverage = this.getAttribute('thresholdPercentageOfAverage')
    for (var y = 0; y < imageIn.getHeight(); y++) {
      for (var x = 0; x < imageIn.getWidth(); x++) {
        this.theshold(
          imageIn,
          imageOut,
          x,
          y,
          thresholdPercentageOfAverage,
          neighborhoodSide,
          samplingPixelDistance,
        )
      }
    }
  }
  theshold(
    image,
    imageOut,
    x,
    y,
    thresholdPercentageOfAverage,
    side,
    neighborhoodDistance,
  ) {
    var min = -1
    var max = -1
    var pixels = 0
    var average = 0
    var inc = neighborhoodDistance
    for (var j = y - side / 2; j < y + (inc + side / 2); j += inc) {
      for (var i = x - side / 2; i < x + side / 2; i += inc) {
        if (i >= 0 && j >= 0 && i < image.getWidth() && j < image.getHeight()) {
          var color = image.getIntComponent0(i, j)
          if (min == -1 || color < min) {
            min = color
          }
          if (max == -1 || color > max) {
            max = color
          }
          average += color
          pixels++
        }
      }
    }
    average /= pixels
    var color = image.getIntComponent0(x, y)
    if (color < average * thresholdPercentageOfAverage || max - min <= 30) {
      imageOut.setIntColor(x, y, 255, 0, 0, 0)
    } else {
      imageOut.setIntColor(x, y, 255, 255, 255, 255)
    }
  }
}
class CombineByAlpha extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('x', 0)
    this.setAttribute('y', 0)
    this.setAttribute('imageOther', null)
  }
  process(imageIn, imageOut) {
    var imageOther = this.getAttribute('imageOther')
    var x = this.getAttribute('x')
    var y = this.getAttribute('y')
    if (imageOther != null) {
      for (var j = 0; j < imageIn.getHeight(); j++) {
        for (var i = 0; i < imageIn.getWidth(); i++) {
          var ox = i - x
          var oy = j - y
          if (
            ox >= 0 &&
            ox < imageOther.getWidth() &&
            oy >= 0 &&
            oy < imageOther.getHeight()
          ) {
            var alpha = imageOther.getAlphaComponent(ox, oy)
            if (alpha != 0) {
              var factor = alpha / 255
              var rA = imageIn.getIntComponent0(i, j)
              var gA = imageIn.getIntComponent1(i, j)
              var bA = imageIn.getIntComponent2(i, j)
              var rB = imageOther.getIntComponent0(ox, oy)
              var gB = imageOther.getIntComponent1(ox, oy)
              var bB = imageOther.getIntComponent2(ox, oy)
              var red = Math.floor(rA * (1 - factor) + rB * factor)
              var green = Math.floor(gA * (1 - factor) + gB * factor)
              var blue = Math.floor(bA * (1 - factor) + bB * factor)
              imageOut.setIntColor(
                i,
                j,
                Math.max(imageIn.getAlphaComponent(x, y), alpha),
                red,
                green,
                blue,
              )
            } else {
              imageOut.setIntColor(i, j, imageIn.getIntColor(i, j))
            }
          } else {
            imageOut.setIntColor(i, j, imageIn.getIntColor(i, j))
          }
        }
      }
    }
  }
}
class MergePhotos extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.background = new DetermineSceneBackground()
    this.setAttribute('threshold', 30)
  }
  process(images, imageOut) {
    if (images.length > 0) {
      var threshold = this.getAttribute('threshold')
      this.background.setAttribute('threshold', threshold)
      var backgroundImage = images[0].clone()
      this.background.process(images, backgroundImage)
      backgroundImage.copyColorArray(imageOut)
      this.mergePhotos(images, imageOut, backgroundImage, threshold)
    }
  }
  mergePhotos(images, imageOut, background, threshold) {
    for (var i in images) {
      var img = images[i]
      this.mergePhotosSingle(img, imageOut, background, threshold)
    }
  }
  mergePhotosSingle(imageA, imageB, imageBackground, threshold) {
    var rA, gA, bA, rB, gB, bB
    for (var y = 0; y < imageA.getHeight(); y++) {
      for (var x = 0; x < imageA.getWidth(); x++) {
        rA = imageA.getIntComponent0(x, y)
        gA = imageA.getIntComponent1(x, y)
        bA = imageA.getIntComponent2(x, y)
        rB = imageBackground.getIntComponent0(x, y)
        gB = imageBackground.getIntComponent1(x, y)
        bB = imageBackground.getIntComponent2(x, y)
        if (
          Math.abs(rA - rB) > threshold ||
          Math.abs(gA - gB) > threshold ||
          Math.abs(bA - bB) > threshold
        ) {
          imageB.setIntColor(x, y, 255, rA, gA, bA)
        }
      }
    }
  }
}
class Convolution extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('matrix', null)
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    var matrix = this.getAttribute('matrix')
    if (matrix != null && matrix.length > 0) {
      for (var y = 0; y < imageIn.getHeight(); y++) {
        for (var x = 0; x < imageIn.getWidth(); x++) {
          if (
            y >= matrix.length / 2 &&
            y < imageIn.getHeight() - matrix.length / 2 &&
            x >= matrix[0].length / 2 &&
            x < imageIn.getWidth() - matrix[0].length / 2
          ) {
            this.applyMatrix(x, y, matrix, imageIn, imageOut)
          } else {
            imageOut.setIntColor(x, y, 0xff000000)
          }
        }
      }
    }
  }
  applyMatrix(x, y, matrix, imageIn, imageOut) {
    var nx, ny
    var resultRed = 0
    var resultGreen = 0
    var resultBlue = 0
    var xC = Math.ceil(matrix[0].length / 2)
    var yC = Math.ceil(matrix.length / 2)
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[0].length; j++) {
        if (matrix[i][j] != 0) {
          nx = x + (j - xC)
          ny = y + (i - yC)
          if (
            nx >= 0 &&
            nx < imageOut.getWidth() &&
            ny >= 0 &&
            ny < imageOut.getHeight()
          ) {
            resultRed += matrix[i][j] * imageIn.getIntComponent0(nx, ny)
            resultGreen += matrix[i][j] * imageIn.getIntComponent1(nx, ny)
            resultBlue += matrix[i][j] * imageIn.getIntComponent2(nx, ny)
          }
        }
      }
    }
    resultRed = Math.abs(resultRed)
    resultGreen = Math.abs(resultGreen)
    resultBlue = Math.abs(resultBlue)
    // allow the combination of multiple applications
    resultRed += imageOut.getIntComponent0(x, y)
    resultGreen += imageOut.getIntComponent1(x, y)
    resultBlue += imageOut.getIntComponent2(x, y)
    resultRed = Math.min(resultRed, 255)
    resultGreen = Math.min(resultGreen, 255)
    resultBlue = Math.min(resultBlue, 255)
    resultRed = Math.max(resultRed, 0)
    resultGreen = Math.max(resultGreen, 0)
    resultBlue = Math.max(resultBlue, 0)
    imageOut.setIntColor(
      x,
      y,
      imageIn.getAlphaComponent(x, y),
      Math.floor(resultRed),
      Math.floor(resultGreen),
      Math.floor(resultBlue),
    )
  }
}
class Moravec extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]
    this.setAttribute('matrixSize', 3)
    this.setAttribute('threshold', 0)
  }
  process(imageIn, attrOut) {
    var matrixSize = this.getAttribute('matrixSize')
    var threshold = this.getAttribute('threshold')
    var tempImage = new MarvinImage(imageIn.getWidth(), imageIn.getHeight())
    Marvin.grayScale(imageIn, tempImage)
    var cornernessMap = createMatrix2D(tempImage.getWidth(), tempImage.getHeight(), 0)
    var cornernessMapOut = createMatrix2D(tempImage.getWidth(), tempImage.getHeight(), 0)
    for (var y = 0; y < tempImage.getHeight(); y++) {
      for (var x = 0; x < tempImage.getWidth(); x++) {
        cornernessMap[x][y] = this.c(x, y, matrixSize, tempImage)
        if (cornernessMap[x][y] < threshold) {
          cornernessMap[x][y] = 0
        }
      }
    }
    for (var x = 0; x < cornernessMap.length; x++) {
      for (var y = 0; y < cornernessMap[x].length; y++) {
        cornernessMapOut[x][y] = this.nonmax(x, y, matrixSize, cornernessMap)
        if (cornernessMapOut[x][y] > 0) {
          cornernessMapOut[x][y] = 1
        }
      }
    }
    if (attrOut != null) {
      attrOut.set('cornernessMap', cornernessMapOut)
    }
  }
  nonmax(x, y, matrixSize, matrix) {
    var s = Math.floor(matrixSize / 2)
    if (
      x - (s + 1) >= 0 &&
      x + (s + 1) < matrix.length &&
      y - (s + 1) >= 0 &&
      y + (s + 1) < matrix[0].length
    ) {
      for (var i = -s; i <= s; i++) {
        for (var j = -s; j <= s; j++) {
          if (i != 0 || j != 0) {
            if (matrix[x][y] < matrix[x + i][y + j]) {
              return 0
            }
          }
        }
      }
    }
    return matrix[x][y]
  }
  c(x, y, matrixSize, image) {
    var ret = -1
    var temp
    var s = Math.floor(matrixSize / 2)
    if (
      x - (s + 1) >= 0 &&
      x + (s + 1) < image.getWidth() &&
      y - (s + 1) >= 0 &&
      y + (s + 1) < image.getHeight()
    ) {
      for (var d = 0; d < this.directions.length; d++) {
        temp = 0
        for (var i = -s; i <= s; i++) {
          for (var j = -s; j <= s; j++) {
            temp += Math.pow(
              image.getIntComponent0(x + i, y + j) -
                image.getIntComponent0(
                  x + i + this.directions[d][0],
                  y + j + this.directions[d][1],
                ),
              2,
            )
          }
        }
        if (ret == -1 || temp < ret) {
          ret = temp
        }
      }
    }
    return ret
  }
}
/**
 * @author Gabriel Ambrósio Archanjo
 */
class Prewitt extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.matrixPrewittX = [
      [1, 0, -1],
      [1, 0, -1],
      [1, 0, -1],
    ]
    this.matrixPrewittY = [
      [1, 1, 1],
      [0, 0, 0],
      [-1, -1, -1],
    ]
    this.convolution = new Convolution()
    this.setAttribute('intensity', 1.0)
  }
  process(imageIn, imageOut, mask, previewMode) {
    var intensity = this.getAttribute('intensity')
    if (intensity == 1) {
      this.convolution.setAttribute('matrix', this.matrixPrewittX)
      this.convolution.process(imageIn, imageOut, null, mask, previewMode)
      this.convolution.setAttribute('matrix', this.matrixPrewittY)
      this.convolution.process(imageIn, imageOut, null, mask, previewMode)
    } else {
      this.convolution.setAttribute('matrix', scaleMatrix(this.matrixPrewittX, intensity))
      this.convolution.process(imageIn, imageOut, null, mask, previewMode)
      this.convolution.setAttribute('matrix', scaleMatrix(this.matrixPrewittY, intensity))
      this.convolution.process(imageIn, imageOut, null, mask, previewMode)
    }
  }
}
class BoundaryFill extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('x', 0)
    this.setAttribute('y', 0)
    this.setAttribute('color', 0xffff0000)
    this.setAttribute('tile', null)
    this.setAttribute('threshold', 0)
  }
  process(imageIn, imageOut) {
    var l_list = new Array()
    var l_point, l_pointW, l_pointE
    //MarvinImage.copyColorArray(imgIn, imgOut);
    var x = this.getAttribute('x')
    var y = this.getAttribute('y')
    var tileImage = this.getAttribute('tile')
    this.threshold = this.getAttribute('threshold')
    if (!imageOut.isValidPosition(x, y)) {
      return
    }
    var targetColor = imageIn.getIntColor(x, y)
    var targetRed = imageIn.getIntComponent0(x, y)
    var targetGreen = imageIn.getIntComponent1(x, y)
    var targetBlue = imageIn.getIntComponent2(x, y)
    var color = this.getAttribute('color')
    var newColor = color
    var fillMask = createMatrix2D(imageOut.getWidth(), imageOut.getHeight(), false)
    fillMask[x][y] = true
    l_list.push(new MarvinPoint(x, y))
    //for(var l_i=0; l_i<l_list.size(); l_i++){
    while (l_list.length > 0) {
      l_point = l_list.splice(0, 1)[0] // list poll
      l_pointW = new MarvinPoint(l_point.x, l_point.y)
      l_pointE = new MarvinPoint(l_point.x, l_point.y)
      // west
      while (true) {
        if (
          l_pointW.x - 1 >= 0 &&
          this.match(
            imageIn,
            l_pointW.x - 1,
            l_pointW.y,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold,
          ) &&
          !fillMask[l_pointW.x - 1][l_pointW.y]
        ) {
          l_pointW.x--
        } else {
          break
        }
      }
      // east
      while (true) {
        if (
          l_pointE.x + 1 < imageIn.getWidth() &&
          this.match(
            imageIn,
            l_pointE.x + 1,
            l_pointE.y,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold,
          ) &&
          !fillMask[l_pointE.x + 1][l_pointE.y]
        ) {
          l_pointE.x++
        } else {
          break
        }
      }
      // set color of pixels between pointW and pointE
      for (var l_px = l_pointW.x; l_px <= l_pointE.x; l_px++) {
        //imgOut.setIntColor(l_px, l_point.y, -1);
        //drawPixel(imgOut, l_px, l_point.y, newColor, tileImage);
        fillMask[l_px][l_point.y] = true
        if (
          l_point.y - 1 >= 0 &&
          this.match(
            imageIn,
            l_px,
            l_point.y - 1,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold,
          ) &&
          !fillMask[l_px][l_point.y - 1]
        ) {
          l_list.push(new MarvinPoint(l_px, l_point.y - 1))
        }
        if (
          l_point.y + 1 < imageOut.getHeight() &&
          this.match(
            imageIn,
            l_px,
            l_point.y + 1,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold,
          ) &&
          !fillMask[l_px][l_point.y + 1]
        ) {
          l_list.push(new MarvinPoint(l_px, l_point.y + 1))
        }
      }
    }
    if (tileImage != null) {
      /* Plugin not ported yet. */
      /*
            var p = MarvinPluginLoader.loadImagePlugin("org.marvinproject.image.texture.tileTexture.jar");
            p.setAttribute("lines", (int)(Math.ceil((double)imgOut.getHeight()/tileImage.getHeight())));
            p.setAttribute("columns", (int)(Math.ceil((double)imgOut.getWidth()/tileImage.getWidth())));
            p.setAttribute("tile", tileImage);
            MarvinImageMask newMask = new MarvinImageMask(fillMask);
            p.process(imgOut, imgOut, null, newMask, false);
            */
    } else {
      for (var j = 0; j < imageOut.getHeight(); j++) {
        for (var i = 0; i < imageOut.getWidth(); i++) {
          if (fillMask[i][j]) {
            imageOut.setIntColor(i, j, newColor)
          }
        }
      }
    }
  }
  match(image, x, y, targetRed, targetGreen, targetBlue, threshold) {
    var diff =
      Math.abs(image.getIntComponent0(x, y) - targetRed) +
      Math.abs(image.getIntComponent1(x, y) - targetGreen) +
      Math.abs(image.getIntComponent2(x, y) - targetBlue)
    return diff <= threshold
  }
}
class ErrorDiffusion extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.threshold = 128
  }
  process(imageIn, imageOut, mask) {
    var dif
    Marvin.grayScale(imageIn, imageOut)
    // Mask
    var l_arrMask
    if (mask != null) {
      l_arrMask = mask.getMask()
    }
    for (var y = 0; y < imageOut.getHeight(); y++) {
      for (var x = 0; x < imageOut.getWidth(); x++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue
        }
        let color = imageOut.getIntComponent0(x, y)
        if (color > this.threshold) {
          imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), 255, 255, 255)
          dif = -(255 - color)
        } else {
          imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), 0, 0, 0)
          dif = color
        }
        // Pixel Right
        if (x + 1 < imageOut.getWidth()) {
          color = imageOut.getIntComponent0(x + 1, y)
          color += Math.floor(0.4375 * dif)
          color = this.getValidGray(color)
          imageOut.setIntColor(
            x + 1,
            y,
            imageIn.getAlphaComponent(x + 1, y),
            color,
            color,
            color,
          )
          // Pixel Right Down
          if (y + 1 < imageOut.getHeight()) {
            color = imageOut.getIntComponent0(x + 1, y + 1)
            color += Math.floor(0.0625 * dif)
            color = this.getValidGray(color)
            imageOut.setIntColor(
              x + 1,
              y + 1,
              imageIn.getAlphaComponent(x + 1, y + 1),
              color,
              color,
              color,
            )
          }
        }
        // Pixel Down
        if (y + 1 < imageOut.getHeight()) {
          color = imageOut.getIntComponent0(x, y + 1)
          color += Math.floor(0.3125 * dif)
          color = this.getValidGray(color)
          imageOut.setIntColor(
            x,
            y + 1,
            imageIn.getAlphaComponent(x, y + 1),
            color,
            color,
            color,
          )
          // Pixel Down Left
          if (x - 1 >= 0) {
            color = imageOut.getIntComponent0(x - 1, y + 1)
            color += Math.floor(0.1875 * dif)
            color = this.getValidGray(color)
            imageOut.setIntColor(
              x - 1,
              y + 1,
              imageIn.getAlphaComponent(x - 1, y + 1),
              color,
              color,
              color,
            )
          }
        }
      }
    }
  }
  getValidGray(a_value) {
    if (a_value < 0) return 0
    if (a_value > 255) return 255
    return a_value
  }
}
class Closing extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.matrix = createMatrix2D(3, 3, true)
    this.setAttribute('matrix', 3)
  }
  process(imageIn, imageOut) {
    var matrix = this.getAttribute('matrix')
    if (imageIn.getColorModel() == COLOR_MODEL_BINARY && matrix != null) {
      Marvin.morphologicalDilation(imageIn, imageOut, matrix)
      imageOut.copyColorArray(imageIn)
      Marvin.morphologicalErosion(imageIn, imageOut, matrix)
    }
  }
}
class Dilation extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.matrix = createMatrix2D(3, 3, true)
    this.setAttribute('matrix', 3)
  }
  process(imageIn, imageOut) {
    var matrix = this.getAttribute('matrix')
    if (imageIn.getColorModel() == COLOR_MODEL_BINARY && matrix != null) {
      imageIn.copyColorArray(imageOut)
      for (var y = 0; y < imageIn.getHeight(); y++) {
        for (var x = 0; x < imageIn.getWidth(); x++) {
          this.applyMatrix(x, y, matrix, imageIn, imageOut)
        }
      }
    }
  }
  applyMatrix(x, y, matrix, imgIn, imgOut) {
    var nx, ny
    var xC = matrix[0].length / 2
    var yC = matrix.length / 2
    if (imgIn.getBinaryColor(x, y)) {
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix.length; j++) {
          if ((i != yC || j != xC) && matrix[i][j]) {
            nx = x + (j - xC)
            ny = y + (i - yC)
            if (nx > 0 && nx < imgOut.getWidth() && ny > 0 && ny < imgOut.getHeight()) {
              imgOut.setBinaryColor(nx, ny, true)
            }
          }
        }
      }
    }
  }
}
class Erosion extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.matrix = createMatrix2D(3, 3, true)
    this.setAttribute('matrix', 3)
  }
  process(imageIn, imageOut) {
    var matrix = this.getAttribute('matrix')
    if (imageIn.getColorModel() == COLOR_MODEL_BINARY && matrix != null) {
      imageIn.copyColorArray(imageOut)
      for (var y = 0; y < imageIn.getHeight(); y++) {
        for (var x = 0; x < imageIn.getWidth(); x++) {
          this.applyMatrix(x, y, matrix, imageIn, imageOut)
        }
      }
    }
  }
  applyMatrix(x, y, matrix, imgIn, imgOut) {
    var nx, ny
    var xC = Math.floor(matrix[0].length / 2)
    var yC = Math.floor(matrix.length / 2)
    if (!imgIn.getBinaryColor(x, y)) {
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[0].length; j++) {
          if ((i != yC || j != xC) && matrix[i][j]) {
            nx = x + (j - xC)
            ny = y + (i - yC)
            if (nx >= 0 && nx < imgOut.getWidth() && ny >= 0 && ny < imgOut.getHeight()) {
              imgOut.setBinaryColor(nx, ny, false)
            }
          }
        }
      }
    }
  }
}
class FindTextRegions {
  constructor(maxWhiteSpace, maxFontLineWidth, minTextWidth, grayScaleThreshold) {
    this.maxWhiteSpace = maxWhiteSpace
    this.maxFontLineWidth = maxFontLineWidth
    this.minTextWidth = minTextWidth
    this.grayScaleThreshold = grayScaleThreshold
  }
  process(imageIn) {
    // The image will be affected so it's generated a new instance
    imageIn = imageIn.clone()
    const thresholder = new Thresholding()
    thresholder.setAttribute('threshold', this.grayScaleThreshold)
    thresholder.setAttribute('thresholdRange', undefined)
    thresholder.process(imageIn, imageIn, NULL_MASK)
    var segments = Array(0)
    for (let i = 0; i < imageIn.getHeight(); i++) {
      segments.push([])
    }
    var patternStartX = -1
    var patternLength = 0
    var whitePixels = 0
    var blackPixels = 0
    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        let color = imageIn.getIntColor(x, y)
        if (color == 0xffffffff && patternStartX != -1) {
          whitePixels++
          blackPixels = 0
        }
        if (color == 0xff000000) {
          blackPixels++
          if (patternStartX == -1) {
            patternStartX = x
          }
          whitePixels = 0
        }
        // check white and black pattern maximum lenghts
        if (
          whitePixels > this.maxWhiteSpace ||
          blackPixels > this.maxFontLineWidth ||
          x == imageIn.getWidth() - 1
        ) {
          if (patternLength >= this.minTextWidth) {
            var list = segments[y]
            list.push([patternStartX, y, patternStartX + patternLength, y])
          }
          whitePixels = 0
          blackPixels = 0
          patternLength = 0
          patternStartX = -1
        }
        if (patternStartX != -1) {
          patternLength++
        }
      }
    }
    // Group line patterns intersecting in x coordinate and too near in y coordinate.
    for (var y = 0; y < imageIn.getHeight() - 2; y++) {
      var listY = segments[y]
      for (var w = y + 1; w <= y + 2; w++) {
        var listW = segments[w]
        for (var i = 0; i < listY.length; i++) {
          var sA = listY[i]
          for (var j = 0; j < listW.length; j++) {
            var sB = listW[j]
            // horizontal intersection
            if (
              (sA[0] <= sB[0] && sA[2] >= sB[2]) ||
              (sA[0] >= sB[0] && sA[0] <= sB[2]) ||
              (sA[2] >= sB[0] && sA[2] <= sB[2])
            ) {
              sA[0] = Math.min(sA[0], sB[0])
              sA[2] = Math.max(sA[2], sB[2])
              sA[3] = sB[3]
              listY.splice(i, 1)
              i--
              listW.splice(j, 1)
              listW.push(sA)
              break
            }
          }
        }
      }
    }
    // Convert the result to a List<> of MarvinSegment objects.
    var marvinSegments = []
    for (let y = 0; y < imageIn.getHeight(); y++) {
      var list = segments[y]
      for (let i in list) {
        var seg = list[i]
        marvinSegments.push(new MarvinSegment(seg[0], seg[1], seg[2], seg[3]))
      }
    }
    return marvinSegments
  }
}
class IteratedFunctionSystem extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.rules = []
    this.EXAMPLE_RULES =
      '0,0,0,0.16,0,0,0.01\n' +
      '0.85,0.04,-0.04,0.85,0,1.6,0.85\n' +
      '0.2,-0.26,0.23,0.22,0,1.6,0.07\n' +
      '-0.15,0.28,0.26,0.24,0,0.44,0.07\n'
    this.setAttribute('rules', this.EXAMPLE_RULES)
    this.setAttribute('iterations', 1000000)
  }
  process(imageIn, imageOut) {
    this.loadRules()
    var iterations = this.getAttribute('iterations')
    var x0 = 0
    var y0 = 0
    var x, y
    var startX
    var startY
    var factor
    var minX = 999999999,
      minY = 999999999,
      maxX = -999999999,
      maxY = -99999999
    var tempRule
    var point = [x0, y0]
    imageOut.clear(0xffffffff)
    for (var i = 0; i < iterations; i++) {
      tempRule = this.getRule()
      this.applyRule(point, tempRule)
      x = point[0]
      y = point[1]
      if (x < minX) {
        minX = x
      }
      if (x > maxX) {
        maxX = x
      }
      if (y < minY) {
        minY = y
      }
      if (y > maxY) {
        maxY = y
      }
    }
    var width = imageOut.getWidth()
    var height = imageOut.getHeight()
    var deltaX = Math.abs(maxX - minX)
    var deltaY = Math.abs(maxY - minY)
    if (deltaX > deltaY) {
      factor = width / deltaX
      if (deltaY * factor > height) {
        factor = factor * (height / (deltaY * factor))
      }
    } else {
      factor = height / deltaY
      if (deltaX * factor > width) {
        factor = factor * (width / (deltaX * factor))
      }
    }
    factor *= 0.9
    startX = Math.floor(width / 2 - (minX + deltaX / 2) * factor)
    startY = Math.floor(height - (height / 2 - (minY + deltaY / 2) * factor))
    point[0] = x0
    point[1] = y0
    for (var i = 0; i < iterations; i++) {
      tempRule = this.getRule()
      this.applyRule(point, tempRule)
      x = Math.floor(point[0] * factor + startX)
      y = startY - Math.floor(point[1] * factor)
      if (x >= 0 && x < width && y >= 0 && y < height) {
        imageOut.setIntColor(Math.floor(x), Math.floor(y), 255, 0)
      }
    }
  }
  loadRules() {
    this.rules = []
    var r = this.getAttribute('rules').split('\n')
    for (var i = 0; i < r.length; i++) {
      this.addRule(r[i])
    }
  }
  addRule(rule) {
    rule = rule.replace(/ /g, '') //replace all spaces
    var attr = rule.split(',')
    if (attr.length == 7) {
      let r = {}
      r.a = parseFloat(attr[0])
      r.b = parseFloat(attr[1])
      r.c = parseFloat(attr[2])
      r.d = parseFloat(attr[3])
      r.e = parseFloat(attr[4])
      r.f = parseFloat(attr[5])
      r.probability = parseFloat(attr[6])
      this.rules.push(r)
    }
  }
  getRule() {
    var random = Math.random()
    var sum = 0
    var i
    for (i = 0; i < this.rules.length; i++) {
      sum += this.rules[i].probability
      if (random < sum) {
        return this.rules[i]
      }
    }
    if (i != 0) {
      return this.rules[i - 1]
    }
    return this.rules[0]
  }
  applyRule(point, rule) {
    var nx = rule.a * point[0] + rule.b * point[1] + rule.e
    var ny = rule.c * point[0] + rule.d * point[1] + rule.f
    point[0] = nx
    point[1] = ny
  }
}
class Crop extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('x', 0)
    this.setAttribute('y', 0)
    this.setAttribute('width', 0)
    this.setAttribute('height', 0)
  }
  process(imageIn, imageOut) {
    var x = this.getAttribute('x')
    var y = this.getAttribute('y')
    var width = this.getAttribute('width')
    var height = this.getAttribute('height')
    imageOut.setDimension(width, height)
    for (var i = x; i < x + width; i++) {
      for (var j = y; j < y + height; j++) {
        imageOut.setIntColor(i - x, j - y, imageIn.getIntColor(i, j))
      }
    }
  }
}
class Scale extends MarvinAbstractImagePlugin {
  constructor() {
    super()
    this.setAttribute('newWidth', 0)
    this.setAttribute('newHeight', 0)
  }
  process(imageIn, imageOut) {
    var width = imageIn.getWidth()
    var height = imageIn.getHeight()
    var newWidth = this.getAttribute('newWidth')
    var newHeight = this.getAttribute('newHeight')
    if (imageOut.getWidth() != newWidth || imageOut.getHeight() != newHeight) {
      imageOut.setDimension(newWidth, newHeight)
    }
    var x_ratio = Math.floor((width << 16) / newWidth)
    var y_ratio = Math.floor((height << 16) / newHeight)
    var x2, y2
    for (var i = 0; i < newHeight; i++) {
      for (var j = 0; j < newWidth; j++) {
        x2 = Math.floor((j * x_ratio) >> 16)
        y2 = Math.floor((i * y_ratio) >> 16)
        imageOut.setIntColor(
          j,
          i,
          imageIn.getAlphaComponent(x2, y2),
          imageIn.getIntColor(x2, y2),
        )
      }
    }
  }
}
class MarvinAttributes {
  constructor() {
    this.hashAttributes = new Object()
  }
  set(name, value) {
    this.hashAttributes[name] = value
  }
  get(name, defaultValue) {
    var ret = this.hashAttributes[name]
    if (ret != null) {
      return ret
    }
    return defaultValue
  }
  clone() {
    var attrs = new MarvinAttributes()
    for (var key in this.hashAttributes) {
      attrs.set(key, this.hashAttributes[key])
    }
    return attrs
  }
}
class MarvinPoint {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  setX(x) {
    this.x = x
  }
  setY(y) {
    this.y = y
  }
  getX() {
    return this.x
  }
  getY() {
    return this.y
  }
}
class MarvinClass {
  constructor() {
    this.alphaBoundaryPlugin = new AlphaBoundary()
    this.averageColorPlugin = new AverageColor()
    this.blackAndWhitePlugin = new BlackAndWhite()
    this.boundaryFillPlugin = new BoundaryFill()
    this.brightnessAndContrastPlugin = new BrightnessAndContrast()
    this.colorChannelPlugin = new ColorChannel()
    this.cropPlugin = new Crop()
    this.combineByAlphaPlugin = new CombineByAlpha()
    this.embossPlugin = new Emboss()
    this.halftoneErrorDiffusionPlugin = new ErrorDiffusion()
    this.gaussianBlurPlugin = new GaussianBlur()
    this.invertColorsPlugin = new Invert()
    this.iteratedFunctionSystemPlugin = new IteratedFunctionSystem()
    this.grayScalePlugin = new GrayScale()
    this.mergePhotosPlugin = new MergePhotos()
    this.moravecPlugin = new Moravec()
    this.morphologicalDilationPlugin = new Dilation()
    this.morphologicalErosionPlugin = new Erosion()
    this.morphologicalClosingPlugin = new Closing()
    this.prewittPlugin = new Prewitt()
    this.scalePlugin = new Scale()
    this.sepiaPlugin = new Sepia()
    this.thresholdingPlugin = new Thresholding()
    this.thresholdingNeighborhoodPlugin = new ThresholdingNeighborhood()
  }
  getValue(value, defaultValue) {
    if (value != null) {
      return value
    } else {
      return defaultValue
    }
  }
  alphaBoundary(imageIn, imageOut, radius) {
    this.alphaBoundaryPlugin.setAttribute('radius', radius)
    this.alphaBoundaryPlugin.process(imageIn, imageOut)
  }
  averageColor(imageIn) {
    const attrOut = new MarvinAttributes()
    this.averageColorPlugin.process(imageIn, attrOut)
    return attrOut.get('averageColor')
  }
  blackAndWhite(imageIn, imageOut, level) {
    this.blackAndWhitePlugin.setAttribute('level', level)
    this.blackAndWhitePlugin.process(imageIn, imageOut)
  }
  boundaryFill(imageIn, imageOut, x, y, color, threshold) {
    this.boundaryFillPlugin.setAttribute('x', x)
    this.boundaryFillPlugin.setAttribute('y', y)
    this.boundaryFillPlugin.setAttribute('color', color)
    if (threshold != null) {
      this.boundaryFillPlugin.setAttribute('threshold', threshold)
    }
    this.boundaryFillPlugin.process(imageIn, imageOut)
  }
  brightnessAndContrast(imageIn, imageOut, brightness, contrast) {
    this.brightnessAndContrastPlugin.setAttribute('brightness', brightness)
    this.brightnessAndContrastPlugin.setAttribute('contrast', contrast)
    this.brightnessAndContrastPlugin.process(imageIn, imageOut)
  }
  colorChannel(imageIn, imageOut, red, green, blue) {
    this.colorChannelPlugin.setAttribute('red', red)
    this.colorChannelPlugin.setAttribute('green', green)
    this.colorChannelPlugin.setAttribute('blue', blue)
    this.colorChannelPlugin.process(imageIn, imageOut)
  }
  crop(imageIn, imageOut, x, y, width, height) {
    this.cropPlugin.setAttribute('x', x)
    this.cropPlugin.setAttribute('y', y)
    this.cropPlugin.setAttribute('width', width)
    this.cropPlugin.setAttribute('height', height)
    this.cropPlugin.process(imageIn, imageOut)
  }
  combineByAlpha(imageIn, imageOther, imageOut, x, y) {
    this.combineByAlphaPlugin.setAttribute('imageOther', imageOther)
    this.combineByAlphaPlugin.setAttribute('x', x)
    this.combineByAlphaPlugin.setAttribute('y', y)
    this.combineByAlphaPlugin.process(imageIn, imageOut)
  }
  emboss(imageIn, imageOut) {
    this.embossPlugin.process(imageIn, imageOut, NULL_MASK)
  }
  halftoneErrorDiffusion(imageIn, imageOut) {
    this.halftoneErrorDiffusionPlugin.process(imageIn, imageOut, NULL_MASK)
  }
  gaussianBlur(imageIn, imageOut, radius) {
    this.gaussianBlurPlugin.setAttribute('radius', Marvin.getValue(radius, 3.0))
    this.gaussianBlurPlugin.process(imageIn, imageOut, NULL_MASK)
  }
  invertColors(imageIn, imageOut) {
    this.invertColorsPlugin.process(imageIn, imageOut, NULL_MASK)
  }
  iteratedFunctionSystem(imageIn, imageOut, rules, iterations) {
    this.iteratedFunctionSystemPlugin.setAttribute('rules', rules)
    this.iteratedFunctionSystemPlugin.setAttribute('iterations', iterations)
    this.iteratedFunctionSystemPlugin.process(imageIn, imageOut)
  }
  grayScale(imageIn, imageOut) {
    this.grayScalePlugin.process(imageIn, imageOut, NULL_MASK)
  }
  mergePhotos(images, imageOut, threshold) {
    this.mergePhotosPlugin.setAttribute('threshold', threshold)
    this.mergePhotosPlugin.process(images, imageOut)
  }
  moravec(imageIn, matrixSize, threshold) {
    var attrOut = new MarvinAttributes()
    this.moravecPlugin.setAttribute('matrixSize', matrixSize)
    this.moravecPlugin.setAttribute('threshold', threshold)
    this.moravecPlugin.process(imageIn, attrOut)
    return attrOut.get('cornernessMap')
  }
  morphologicalDilation(imageIn, imageOut, matrix) {
    this.morphologicalDilationPlugin.setAttribute('matrix', matrix)
    this.morphologicalDilationPlugin.process(imageIn, imageOut)
  }
  morphologicalErosion(imageIn, imageOut, matrix) {
    this.morphologicalErosionPlugin.setAttribute('matrix', matrix)
    this.morphologicalErosionPlugin.process(imageIn, imageOut)
  }
  morphologicalClosing(imageIn, imageOut, matrix) {
    this.morphologicalClosingPlugin.setAttribute('matrix', matrix)
    this.morphologicalClosingPlugin.process(imageIn, imageOut)
  }
  prewitt(imageIn, imageOut, intensity) {
    this.prewittPlugin.setAttribute('intensity', Marvin.getValue(intensity, 1.0))
    this.prewittPlugin.process(imageIn, imageOut)
  }
  scale(imageIn, imageOut, newWidth, newHeight) {
    if (newHeight == null) {
      var factor = imageIn.getHeight() / imageIn.getWidth()
      newHeight = Math.floor(factor * newWidth)
    }
    this.scalePlugin.setAttribute('newWidth', newWidth)
    this.scalePlugin.setAttribute('newHeight', newHeight)
    this.scalePlugin.process(imageIn, imageOut)
  }
  sepia(imageIn, imageOut, intensity) {
    this.sepiaPlugin.setAttribute('intensity', intensity)
    this.sepiaPlugin.process(imageIn, imageOut, NULL_MASK)
  }
  thresholding(imageIn, imageOut, threshold, thresholdRange) {
    this.thresholdingPlugin.setAttribute('threshold', threshold)
    this.thresholdingPlugin.setAttribute('thresholdRange', thresholdRange)
    this.thresholdingPlugin.process(imageIn, imageOut, NULL_MASK)
  }
  thresholdingNeighborhood(
    imageIn,
    imageOut,
    thresholdPercentageOfAverage,
    neighborhoodSide,
    samplingPixelDistance,
  ) {
    this.thresholdingNeighborhoodPlugin.setAttribute(
      'thresholdPercentageOfAverage',
      thresholdPercentageOfAverage,
    )
    this.thresholdingNeighborhoodPlugin.setAttribute('neighborhoodSide', neighborhoodSide)
    this.thresholdingNeighborhoodPlugin.setAttribute(
      'samplingPixelDistance',
      samplingPixelDistance,
    )
    this.thresholdingNeighborhoodPlugin.process(imageIn, imageOut)
  }
}
const Marvin = new MarvinClass()

module.exports = {
  MarvinImage,
  MarvinSegment,
  FindTextRegions,
  Marvin,
}
