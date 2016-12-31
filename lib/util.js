'use strict'

/*
 * Part of kagerou
 *
 * (c) 2016 kuriyama hibiya - GNU Public License Version 3
 *
 */

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
      return ['limit break', 'Limit Break']
    } else {
      return [_job.toLowerCase(), _name]
    }
  }

  return [PET_MAPPING[o[1]] || 'chocobo', o[1]]
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
