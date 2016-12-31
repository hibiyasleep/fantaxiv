'use strict'

;(function(){

  class Renderer {

    constructor() {
      this.merged = true
    }

    toggleMerge() {
      this.merged = !this.merged
      this.update()
    }

    render(data) {
      data = data || window.hist.current
      const header = data.header
      const _b = data.get(this.merged)
      const body = _b[0]
      const max = _b[1]
      const rank = body.findIndex(_ => _.name == 'YOU')
      const my = body[rank]

      $('#label-time').textContent = header.duration
      $('#label-damage').textContent = header.damage
      $('#label-rdps').textContent = header.encdps
      $('#label-rank').textContent = (rank + 1) + '/' + body.length

      $('#label-dps').textContent = parseFloat(my.encdps).toFixed(2)
      $('#label-miss').textContent = my.misses
      $('#label-swing').textContent = my.swings

      $('#label-pet-merged').textContent = this.merged
    }

    update() {
      this.render()
    }
  }

  window.Renderer = Renderer

})()
