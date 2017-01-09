'use strict'

/*
 * Part of kagerou
 *
 * (c) 2017 kuriyama hibiya - GNU Public License Version 3
 *
 */

const VERSION = '0.1.0-pre'

const CONFIG_DEFAULT = {
  myname: [],
  id: {
    belong: 'ishgard',
    id: '17-00-000000',
    number: ['00', '아', '0000']
  }
}

;(function() {

  const copy = function copyByJsonString(o) {
    return JSON.parse(JSON.stringify(o))
  }

  class Config {

    constructor() { }

    load() {
      let localConfig = copy(CONFIG_DEFAULT)
      let rawJson = localStorage.getItem('fantaxiv_config')
      let o

      try {
        o = JSON.parse(rawJson)
      } catch(e) { // broken!
        o = null
      }

      if(!o) { // anyway, it's empty, let's populate localStorage
        localStorage.setItem('kagerou_config', JSON.stringify(localConfig))
        this.config = localConfig
      } else {
        this.config = {}

        for(let k in localConfig) {
          if(typeof localConfig[k] !== 'object') {
            this.config[k] = o[k]
          } else {
            this.config[k] = updateObject(localConfig[k], o[k])
          }
        }
      }

      return this.config
    }

    get(k) {
      if(!this.config) return false
      if(k) return resolveDotIndex(this.config, k)
      else return this.config
    }

    set(k, v) {
      if(k)
        return resolveDotIndex(this.config, k, v)
      else
        this.config = v
    }

    save() {
      localStorage.setItem('fantaxiv_config', JSON.stringify(this.config))
    }
  }

  window.Config = Config
  localStorage.getItem('fantaxiv_config')

  window.addEventListener('load', _ => {
    $map('.version', _ => {
      _.textContent = VERSION
    })
  })
})()
