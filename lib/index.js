'use strict'

window.hist = new History()
window.renderer = new Renderer()

const listener = e => {
  window.hist.push(e.detail)
}

document.addEventListener('onOverlayDataUpdate', listener)
document.addEventListener('message', e => {
  if(e.data.type == 'onOverlayDataUpdate') {
    listener(e)
  }
})

window.addEventListener('load', _ => {

  $('#toggle-pet-merge').addEventListener('click', _ => {
    renderer.toggleMerge()
  })

  $('#toggle-blur').addEventListener('click', _ => {
    renderer.toggleBlur()
  })

})
