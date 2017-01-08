'use strict'

;(function(){

  class Renderer {

    constructor() {
      this.merged = true
      this.blurred = false
      this.prevStatus = false
    }

    toggleMerge() {
      this.merged = !this.merged
      this.update()
    }
    toggleBlur() {
      this.blurred = !this.blurred
      $('#label-player-list').classList.toggle('blur', this.blurred)
    }

    render(data) {
      data = data || window.hist.current
      const header = data.header
      const _b = data.get(this.merged)

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

      const jobsContainer = $('#list-jobs')
      const listContainer = $('#label-player-list')

      jobsContainer.innerHTML = ''
      listContainer.innerHTML = ''

      body.forEach(_ => {
        const me = (_.name === 'YOU')? 'me' : ''

        jobsContainer.insertAdjacentHTML(
          'beforeend',
          `<img src="img/class/${_._job.toLowerCase()}.png" class="clsicon ${me}" />`
        )
        listContainer.insertAdjacentHTML(
          'beforeend',
          `<li class="${me}">${_._name}</li>`
        )
      })

      $('#label-time').textContent = header.duration
      $('#label-location').textContent = l.zone(header.CurrentZoneName)
      $('#label-damage').textContent = ~~(header.damage / 1000) * 10
      $('#label-rdps').textContent = header.ENCDPS
      $('#label-rank').textContent = (rank + 1) + '/' + body.length

      $('#label-dps').textContent = my.ENCDPS
      $('#label-miss').textContent = my.misses
      $('#label-swing').textContent = my.swings
      $('#label-damagep').textContent = my['damage%']

      let c = $('#taxi-status').classList
      c.toggle('taxi-active', data.header.isActive)
      c.toggle('taxi-premium', !this.merged)

      if(this.prevStatus != data.header.isActive) {
        this.prevStatus = !this.prevStatus
        window.taxi.toggleStatus(this.prevStatus)
      }
    }

    update() {
      this.render()
    }
  }

  window.Renderer = Renderer

})()
