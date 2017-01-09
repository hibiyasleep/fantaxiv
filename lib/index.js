'use strict'

window.l = new Locale()
window.hist = new History()
window.config = new Config()
window.renderer = new Renderer()

config.load()

const listener = e => {
  window.hist.push(e.detail)
}

document.addEventListener('onOverlayDataUpdate', listener)
document.addEventListener('message', e => {
  if(e.data.type == 'onOverlayDataUpdate') {
    listener(e)
  }
})

const resize = _ => {
  const w = window.innerWidth / 480
  const h = window.innerHeight / 320
  const shorter = w > h? h : w

  $('#container').style.transform = `scale(${shorter})`
}

window.addEventListener('resize', resize)

window.addEventListener('load', _ => {

  window.taxi = new Taxi()

  $('#toggle-pet-merge').addEventListener('click', _ => {
    renderer.toggleMerge()
  })

  $('#toggle-blur').addEventListener('click', _ => {
    renderer.toggleBlur()
  })

  resize()
})
