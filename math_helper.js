function zeros(nx, ny=null) {
  return valueGrid(nx, ny || nx, 0)
}

function nulls(nx,ny=null) {
  return valueGrid(nx, ny || nx, null)
}

function valueGrid(nx, ny, value) {
  if (ny === null) {
    return new Array(nx).fill(value)
  } else {
    return new Array(nx).fill(value).map(() => new Array(ny).fill(value));
  }
}

function map2d(xRange, yRange, fn) {
  let result = zeros(xRange.length, yRange.length)
  for (let i in xRange) {
    let x = xRange[i]
    for (let j in yRange) {
      let y = yRange[j]
      result[j][i] = fn(x,y)
    }
  }
  return result
}

function setRect(array, xLimits, yLimits, value) {
  for (let i = xLimits[0]; i <= xLimits[1]; i++) {
    for (let j = yLimits[0]; j <= yLimits[1]; j++) {
      array[j][i] = value
    }
  }
}

export {zeros, map2d, setRect, nulls}