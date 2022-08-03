const { createMatrix2D } = require('./marvinJSUtils')

function euclideanDistance2D(x1, y1, x2, y2) {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx * dx + dy * dy)
}
function euclideanDistance3D(x1, y1, z1, x2, y2, z2) {
  const dx = x1 - x2
  const dy = y1 - y2
  const dz = z1 - z2
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
function getTrueMatrix(rows, cols) {
  const ret = createMatrix2D(rows, cols)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      ret[i][j] = true
    }
  }
  return ret
}
function scaleMatrix(matrix, scale) {
  const ret = createMatrix2D(matrix.length, matrix.length)
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      ret[i][j] = matrix[i][j] * scale
    }
  }
  return ret
}
function euclideanDistance(p1, p2, p3, p4, p5, p6) {
  if (p5 != undefined && p6 != undefined) {
    return euclideanDistance3D(p1, p2, p3, p4, p5, p6)
  } else {
    return euclideanDistance2D(p1, p2, p3, p4)
  }
}

module.exports = {
  euclideanDistance2D,
  euclideanDistance3D,
  getTrueMatrix,
  scaleMatrix,
  euclideanDistance,
}
