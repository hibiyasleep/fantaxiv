'use strict'

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

  window.addEventListener('load', _ => {
    $map('.version', _ => {
      _.textContent = VERSION
    })
  })
})()
