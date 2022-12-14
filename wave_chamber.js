import { zeros } from "./math_helper"




function WaveChamber({current, previous = current, c = 1, boundaries = null}) {
  let self = {
    previous: previous,
    current: current,
    next: zeros(current.length, current[0].length),
    nx: current[0].length,
    ny: current.length,
    c: c,
    boundaries: boundaries,
    advance,

  }

  let {min, max} = Math
  let {nx, ny} = self


  function advance(dt) {
    let delta = dt**2*self.c**2

    for (let j = 0; j < ny; j++) {
      let jMinus = max(j-1, 0)
      let jPlus = min(j+1, ny-1)
      for (let i = 0; i < nx; i++) {

        let iMinus = max(i-1, 0)
        let iPlus = min(i+1, nx-1)

        if (boundaries && boundaries[j][i] !== null) {
          self.next[j][i] = boundaries[j][i]
          // self.next[j][i] = (0*self.current[j][i] + self.current[jMinus][i] + self.current[jPlus][i] +
          //   self.current[j][iMinus] + self.current[j][iPlus])/4
          continue
        }
        self.next[j][i] = 2*self.current[j][i] - self.previous[j][i] +
          delta*(
            self.current[jMinus][i] - 2*self.current[j][i] + self.current[jPlus][i] +
            self.current[j][iMinus] - 2*self.current[j][i] + self.current[j][iPlus]
          )
      }
    }
    [self.previous, self.current, self.next] = [self.current, self.next, self.previous]
  }


  return self
}

export default WaveChamber