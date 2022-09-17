import './style.css'
import _ from 'lodash'
import Plotly from 'plotly.js-dist-min'
import WaveChamber from './wave_chamber.js'
import {map2d, nulls, setRect} from './math_helper.js'
import {intervalled} from './time_helper.js'

function imagesc(ref, z) {
  let tester = document.getElementById(ref);

  Plotly.newPlot( tester, [{
      z,
      type: 'heatmap',
      zmin: -0.7,
      zmax: 0.7,
    }], {
    margin: { t: 0 } } 
  );
}


let x = _.range(0, 10, 0.1)
const {sin, cos, exp, PI} = Math

let wave1 = map2d(x,x,(x,y) => {
  return 0
  return exp(-((x-3)**2 + (y-5)**2)/0.3)
  // return sin(x)*sin(2*y)
})

let wave2 = map2d(x,x,(x,y) => {
  return 0
  return exp(-((x-3)**2 + (y-5)**2)/0.2) - 0.5*exp(-((x-3)**2 + (y-5)**2)/0.05)
  // return sin(x)*sin(2*y)
})

let nx = x.length
let boundaries = nulls(nx)
setRect(boundaries,[30,30],[0,60], 0)
setRect(boundaries,[60,60],[40,99], 0)

setRect(boundaries,[0,0],[0,nx-1], 0)
setRect(boundaries,[0,nx-1],[0,0], 0)
setRect(boundaries,[nx-1,nx-1],[0,nx-1], 0)
setRect(boundaries,[0,nx-1],[nx-1,nx-1], 0)

let chamber = WaveChamber({previous: wave1, current: wave2, c: 1, boundaries})

imagesc('plot1', chamber.current)

let t = 0
console.log('start')

function saw(t) {
  t = t%1
  return -1+2*t
}



intervalled(1000, 50, () => {
  for (let n=0; n< 5; n++) {
    let DT = 0.3
    t += DT
    chamber.advance(DT)

    // chamber.current[15][15] = 0.5*sin(2*PI*t/30)
    if (t < 30) chamber.current[15][15] = 2*saw(t/12)
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
  imagesc('plot2', chamber.current)
})

