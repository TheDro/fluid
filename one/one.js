import '../style.css'
import _ from 'lodash'
import Plotly from 'plotly.js-dist-min'
import {WaveChamber1D} from '../wave_chamber.js'
import {map1d, nulls, setRect} from '../math_helper.js'
import {intervalled} from '../time_helper.js'
window._ = _

function imagesc(ref, z) {
  let tester = document.getElementById(ref)

  Plotly.newPlot( tester, [{
      z,
      type: 'heatmap',
      zmin: -0.7,
      zmax: 0.7,
    }], {
    margin: { t: 0 } } 
  )
}

function plot(ref,x,y=null) {
  let dom = document.getElementById(ref)
  if (y === null) {
    y = x
    x = _.range(0, y.length)
  }
  Plotly.newPlot(dom, [{
    x,
    y,
    type: 'scatter',
  }], {
    margin: {t: 0},
    yaxis: {range: [-3,3]}
  })
}

let x = _.range(0, 10, 0.1)
const {sin, cos, exp, PI} = Math

let wave1 = map1d(x,(x) => {
  return 0
  return exp(-((x-3)**2 + (y-5)**2)/0.3)
  // return sin(x)*sin(2*y)
})

let wave2 = map1d(x,(x) => {
  return 0
  return exp(-((x-3)**2 + (y-5)**2)/0.2) - 0.5*exp(-((x-3)**2 + (y-5)**2)/0.05)
  // return sin(x)*sin(2*y)
})

let nx = x.length
let boundaries = nulls(nx)
boundaries[0] = 0
boundaries[nx-1] = 0
let chamber = WaveChamber1D({previous: wave1, current: wave2, c: 1, boundaries})


let t = 0
console.log('start')

function saw(t) {
  t = t%1
  return -1+2*t
}

let time = []
let spot1 = []
let spot2 = []
let guess = []

intervalled(400, 16, () => {
  let DT = 0.25
  let N = 10
  for (let n=0; n < N; n++) {
    let dt = DT/N
    t += dt
    chamber.advance(dt)

    // chamber.current[15][15] = 0.5*sin(2*PI*t/30)
    if (t < 20) chamber.current[1] = 1*sin(PI*t/20)
    // chamber.current[75][75] = 0.5*sin(t/1.5)


    // for (let i=0; i< chamber.current.length; i++) {
    //   chamber.current[i][chamber.current[i].length-1] = sin(t/20)
    // }
    // chamber.current[49][49] = sin(t/20)
    // chamber.current[49][50] = sin(t/20)
    // chamber.current[49][51] = sin(t/20)
    // chamber.current[50][49] = sin(t/20)
    // chamber.current[50][50] = sin(t/20)
    // chamber.current[50][51] = sin(t/20)
    // chamber.current[51][49] = sin(t/20)
    // chamber.current[51][50] = sin(t/20)
    // chamber.current[51][51] = sin(t/20)
  }
  time.push(t)
  spot1.push(chamber.current[49])
  spot2.push(chamber.current[50])
  if (spot1.length < 3) {
    guess.push(0)
  } else {
    let i = spot1.length-1
    let currentGuess = interpolate([time[i], spot1[i]], [time[i-1], spot1[i-1]], [time[i-2], spot1[i-2]], time[i]-1)
    guess.push(currentGuess)
  }

  plot('plot1A', spot1)
  plot('plot1B', spot2)
  plot('plot2', chamber.current)
  if (chamber.current[90]>0.1) {
    toTable([_.range(spot1.length), time, spot1, spot2, guess])
    return false
  }
})

function interpolate([x0, y0], [x1, y1], [x2, y2], x3) {
  let y3 = 
    y0*(x3-x1)*(x3-x2)/(x0-x1)/(x0-x2) + 
    y1*(x3-x0)*(x3-x2)/(x1-x0)/(x1-x2) +
    y2*(x3-x0)*(x3-x1)/(x2-x0)/(x2-x1)
  return y3
}

function toTable(data) {
  const headers = ['time', 'spot1', 'spot2'];

  // Create the table element
  const table = document.createElement('table');

  // Create and append table header row
  const headerRow = document.createElement('tr');
  for (const header of headers) {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // Create and append table data rows
  for (let i=0; i<data[0].length; i++) {
    const row = document.createElement('tr');
    for (let j=0; j<data.length; j++) {
      const cell = document.createElement('td');
      cell.textContent = data[j][i].toFixed(4);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // Append the table to a container element (e.g., a div with id "table-container")
  const tableContainer = document.getElementById('table');
  tableContainer.appendChild(table);
}
