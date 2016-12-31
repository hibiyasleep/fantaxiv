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

      console.log(this.merged, _b)

      const body = _b[0].map(_ => {
        if(!_.Job) {
          let r = resolveClass(_.Job, _.name)
          _._job = r[0]
          _._name = r[1]
        } else {
          _._job = _.Job
          _._name = _.name
        }
        return _
      })
      const max = _b[1]
      const rank = body.findIndex(_ => _._name == 'YOU')
      const my = body[rank]

      $('#list-jobs').innerHTML = body
        .map(_ => `<img src="img/class/${_._job.toLowerCase()}.png" class="clsicon" />`)
        .join('')
      $('#label-player-list').innerHTML = body
        .reduce((p, c, i) => p + ` ${i+1}. ${c._name}`, '')

      $('#label-time').textContent = header.duration
      $('#label-location').textContent = header.CurrentZoneName
      $('#label-damage').textContent = ~~(header.damage / 1000) + '0'
      $('#label-rdps').textContent = header.ENCDPS
      $('#label-rank').textContent = (rank + 1) + '/' + body.length

      $('#label-dps').textContent = my.ENCDPS
      $('#label-miss').textContent = my.misses
      $('#label-swing').textContent = my.swings
      $('#label-damagep').textContent = my['damage%']

      let c = $('#taxi-status').classList
      c.toggle('taxi-active', data.header.isActive)
      c.toggle('taxi-premium', !this.merged)
    }

    update() {
      this.render()
    }
  }

  window.Renderer = Renderer

})()
