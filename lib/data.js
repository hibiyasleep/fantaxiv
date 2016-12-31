'use strict'

/*
 * Part of kagerou
 *
 * (c) 2016 kuriyama hibiya - GNU Public License Version 3
 *
 */

const COLUMN_MERGEABLE = [
  'encdps', 'damage', 'swings', 'misses'
]
const SORTABLE = [
  'damage'
]
;(function() {

  const NICK_REGEX = / \(([\uac00-\ud7a3']{1,9}|[A-Z][a-z' ]{0,15})\)$/

  const sanitize = _ => _.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
  const toArray = o => Object.keys(o).map(_ => o[_])

  const isMyPet = owner => window.localStorage.getItem('fantaxiv_myname').split(',').indexOf(owner) != -1

  class Data {

    constructor(data) {
      // reconstruct
      this.update(data)
      this.isCurrent = true
    }

    update(data) {
      this.header = data.Encounter
      this.header.isActive = data.isActive
      this.data = toArray(data.Combatant)
      this.calculateMax(data.Combatant)
    }

    get(merged) {
      let r = this.data.slice(0)

      if(merged) {
        let players = {}

        for(let o of r) {
          let name = o.name
          let owner = resolveOwner(name)
          let isUser = !owner

          if(isMyPet(owner)) {
            owner = 'YOU'
          }
          owner = owner || name

          if(players[owner]) {
            for(let k of COLUMN_MERGEABLE) {
              players[owner][k] = parseFloat(o[k])
                + parseFloat(players[owner][k])
            }

            // if player: override metadata
            if(isUser) {
              players[owner].name = o.name
              players[owner].Job = o.Job
            }

          } else {
            players[owner] = Object.assign({}, o)
          }
        }
        r = toArray(players)
      }

      r = this.sort(r)

      return [r, this.calculateMax(r)]
    }

    sort(target) {
      (target || this.data).sort((a, b) =>
        (parseFloat(b.damage) - parseFloat(a.damage)))

      if(target) return target
    }

    calculateMax(combatant) {
      let max = {}

      for(let v of SORTABLE) {
        max[v] = Math.max.apply(
          Math, Object.keys(combatant).map(_ => combatant[_][v])
        )
      }

      return max
    }

    finalize() {
      this.isCurrent = false
      return this.saveid
    }

  }

  class History {

    constructor() {
      this.lastEncounter = false
      this.currentData = false
      this.history = {}
    }

    push(data) {
      if(this.isNewEncounter(data.Encounter)) {
        if(!window.localStorage.getItem('fantaxiv_myname')
        && NICK_REGEX.test(data.Encounter.title)) {
          let nick = NICK_REGEX.exec(data.Encounter.title)[1]
          window.localStorage.setItem('fantaxiv_myname', nick)
        }
        if(this.currentData) {
          let id = this.currentData.finalize()
          this.history[id] = {
            id: id,
            title: this.currentData.header.title,
            region: this.currentData.header.CurrentZoneName,
            duration: this.currentData.header.duration,
            dps: this.currentData.header.damage /
                 this.currentData.header.DURATION,
            data: this.currentData
          }
        }

        this.currentData = new Data(data)

      } else {
        this.currentData.update(data)
      }

      window.renderer.update()
    }

    updateLastEncounter(encounter) {
      this.lastEncounter = {
        hits: encounter.hits,
        region: encounter.CurrentZoneName,
        damage: encounter.damage,
        duration: parseInt(encounter.DURATION)
      }
    }

    isNewEncounter(encounter) {
      let really = (
        !this.lastEncounter
      || this.lastEncounter.region !== encounter.CurrentZoneName
      || this.lastEncounter.duration > parseInt(encounter.DURATION)
      // ACT-side bug (scrambling data) making this invalid!
      // || this.lastEncounter.damage > encounter.damage
      // || this.lastEncounter.hits > encounter.hits
      )
      this.updateLastEncounter(encounter)
      return really
    }

    get list() { return this.history }

    get current() { return this.currentData }

    browse(id) {
      return this.history[id]
    }
  }

  window.Data = Data
  window.History = History

})()
