function createMatrix2D(rows, cols, value) {
  const arr = new Array(rows)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols)
    arr[i].fill(value)
  }
  return arr
}
function createMatrix3D(rows, cols, depth, value) {
  const arr = new Array(rows)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols)
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = new Array(depth)
      arr[i][j].fill(value)
    }
  }
  return arr
}
function createMatrix4D(rows, cols, depth, another, value) {
  const arr = new Array(rows)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols)
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = new Array(depth)
      for (let w = 0; w < arr[i][j].length; w++) {
        arr[i][j][w] = new Array(another)
        arr[i][j][w].fill(value)
      }
    }
  }
  return arr
}

module.exports = {
  createMatrix2D,
  createMatrix3D,
  createMatrix4D,
}
