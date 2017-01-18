'use strict'

/*
 * Part of kagerou
 *
 * (c) 2016 kuriyama hibiya - GNU Public License Version 3
 *
 */

const audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext)()

const PET_MAPPING = {
  // acn, smn
  '카벙클 에메랄드': 'emerald',
  '가루다 에기': 'garuda',
  '카벙클 토파즈': 'topaz',
  '타이탄 에기': 'titan',
  '이프리트 에기': 'ifrit',
  // sch
  '요정 에오스': 'eos',
  '요정 셀레네': 'selene',
  // mch
  '자동포탑 룩': 'look',
  '자동포탑 비숍': 'bishop'
}

const $ = function $(root, selector, index) {
  'This is not actually jQuery, just shortcut for `document.querySelectorAll`.'
  if(arguments.length === 2) {
    index = selector
    selector = root
    root = document
  } else if(arguments.length === 1) {
    selector = root
    root = document
    index = undefined
  }

  if(!root) {
    root = document
  }

  if(/^#[0-9a-z_\-]+?$/.test(selector))
    return root.getElementById(selector.slice(1))
  else if(index || index === 0)
    if(index === 0)
      return root.querySelector(selector)
    else
      return root.querySelectorAll(selector)[index]
  else
    return root.querySelectorAll(selector)
}

const $map = function $map(root, selector, callback) {
  let _$

  switch(arguments.length) {
    case 2: // selector, callback, undefined
      _$ = $(root)
      callback = selector
      break
    case 3: // selector, index, callback
      _$ = $(root, selector, false)
      break
  }

  return [].map.call(_$, callback)
}

const resolveClass = function resolveJobFromName(_job, _name) {
  _job = _job || ''

  let o = /^(.+?) \((.+?)\)$/.exec(_name)
  if(!o) {
    if(_job === '' && _name === 'Limit Break' || _name === '리미트 브레이크') {
      return ['limit break', '제한 해제']
    } else {
      return [_job.toLowerCase(), _name]
    }
  }

  return [PET_MAPPING[o[1]] || 'chocobo', o[1]]
}

const updateObject = function updateObject(obj/*, ... */) {
  for(let i=1; i<arguments.length; i++) {
    for(let prop in arguments[i]) {
      let val = arguments[i][prop]
      if(typeof val == 'object')
        updateObject(obj[prop], val)
      else
        obj[prop] = val
    }
  }
  return obj
}

const resolveDotIndex = function resolveDotIndex(o, p, v) {
  // Example:
  //   o: {a: {b: {c: 1}}}
  //   p: 'a.b.c'
  //   returns: 1
  if (typeof p === 'string')
    return resolveDotIndex(o, p.split('.'), v);
  else if (p.length === 1 && v !== undefined)
    return o[p[0]] = v;
  else if (p.length==0)
    return o
  else
    return resolveDotIndex(o[p[0]], p.slice(1), v);
}
const resolveOwner = function resolveOwner(_) {
  let o = /^.+? \((.+?)\)$/.exec(_)
  return o && o[1] || undefined
}

const animateNumber = function animateNumber(element, to, option) {
  if(typeof element === 'string') {
    element = $(element, 0)
  }

  option.timeout = option.timeout || 500

  const from = parseFloat(element.textContent)
  const frame = option.frame || 20
  const step = (from - to) / (option.timeout / frame)
  let current = from - step

  let set = function(v) {
    element.textContent = v.toFixed(option.digit || 0)
  }

  let interval = setInterval(function() {
    current -= step
    set(current)
    if(current == to) {
      clearInterval(interval)
    }
  }, frame)

  setTimeout(function() {
    clearInterval(interval)
    set(to)
  }, option.timeout)
}

class EventEmitter {
  /* Copyright (c) 2011 Jerome Etienne, http://jetienne.com - MIT License */

  constructor() { }

  on(event, fct){
    this._events = this._events || {}
    this._events[event] = this._events[event]	|| []
    this._events[event].push(fct)
  }

  off(event, fct){
    this._events = this._events || {}
    if(!(event in this._events)) return
    this._events[event].splice(this._events[event].indexOf(fct), 1)
  }

  emit(event/*, args...*/){
    this._events = this._events || {}
    if(!(event in this._events)) return
    this._events[event].forEach(_ => _.apply(this, [].slice.call(arguments, 1)))
  }
}

const beep = function(duration, freq, volume, type, callback) {
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  if(volume)  gainNode.gain.value = volume
  if(freq)    oscillator.frequency.value = freq
  if(type)    oscillator.type = type
  if(callback) oscillator.onended = callback

  oscillator.start()
  setTimeout(_ => oscillator.stop(), duration || 500)
}
