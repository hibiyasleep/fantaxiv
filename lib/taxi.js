'use strict'

;(function(){

  const FRAME = 5
  const FRAME_MS = 1000 / FRAME

  const FARE = {
    base: {
      normal: 3000,
      surcharge: 3600,
      tick: 2000
    },
    increase: {
      normal: 100,
      surcharge: 160,
      tick: 200
    },
    measure: {
      base: 2000,
      increase: 200
    },
    divider: 50,
    minimum: 100
  }

  const SPEED = {
    cut: 400,
    max: 5,
    min: 0.5
  }

  const isNight = _ => (new Date()).getHours() < 4

  class Taxi {

    constructor() {
      this.timer = {
        tick: null,
        validate: null
      }
      this.dom = {
        horse: $('#horse'),
        measure: $('#label-taximeter')
      }
      this.last = { }
      this.measure = FARE.base.tick

      this.horseStep = 0
      this.speed = 1
      this.tick = 0

      this._resetLast()

    }

    _resetLast() {
      this.last = {
        timestamp: Date.now(),
        timespan: 0,
        damage: 0,
        damagespan: 0
      }
    }

    update() {
      if(!hist.current) return

      let now = Date.now()
      let damage = hist.current.header.damage

      let timespan = now - this.last.timestamp
      let damagespan = damage - this.last.damage

      let speed = (damagespan / timespan) * 1000 / SPEED.cut
      if(speed >= SPEED.max) speed = SPEED.max
      else if(speed <= SPEED.min) speed = SPEED.min

      this.speed = speed
      console.log(speed)

      this.last.timestamp = now
      this.last.timespan = timespan
      // this.last.damagespan = damage - this.last.damage
      this.last.damage = damage
    }

    start() {
      this.timer.tick = setInterval(_ => {
        this.tick++

        this.horseStep += this.speed / 4

        this.render(this.horseStep, this.tick)
      }, FRAME_MS)

      this.timer.validate = setInterval(_ => {
        this.update()
      }, 10000)
    }

    end() {
      this.measure = FARE.base.tick
      if(this.timer.tick) clearInterval(this.timer.tick)
      this.dom.horse.textContent = ''
      this.dom.measure.textContent = ''
    }

    toggleStatus(b) {
      if(b){
        this.dom.measure.textContent = FARE.base.tick
        this.start()
      } else this.end()
    }

    render(step, tick) {
      this.dom.horse.textContent = Math.floor(step) % 4
      this.measure -= this.speed * 1.25
      if(this.measure < 0) {
        this.measure += FARE.increase.tick
      }
      this.dom.measure.textContent = Math.floor(this.measure)
    }

  }

  window.Taxi = Taxi

  window.addEventListener('load', _ => {
    $map('[data-beep]', _ => {
      let duration = parseInt(_.getAttribute('data-beep') || 200)
      _.addEventListener('click', _ => {
        beep(duration, 2000, 0.05, 'square')
      })
    })
  })

})()
