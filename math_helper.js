// Made breaking change
function zeros(nx, ny=null) {
  return valueGrid(nx, ny, 0)
}

function nulls(nx,ny=null) {
  return valueGrid(nx, ny, null)
}

function valueGrid(nx, ny, value) {
  if (ny === null) {
    return new Array(nx).fill(value)
  } else {
    return new Array(nx).fill(value).map(() => new Array(ny).fill(value));
  }
}

function interpolate2([x0, y0], [x1, y1], [x2, y2], x3) {
  let y3 = 
    y0*(x3-x1)*(x3-x2)/(x0-x1)/(x0-x2) + 
    y1*(x3-x0)*(x3-x2)/(x1-x0)/(x1-x2) +
    y2*(x3-x0)*(x3-x1)/(x2-x0)/(x2-x1)
  return y3
}

function map1d(xRange, fn) {
  let result = zeros(xRange.length)
  for (let i in xRange) {
    let x = xRange[i]
    result[i] = fn(x)
  }
  return result
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

export {zeros, map1d, map2d, setRect, nulls, interpolate2}