import _ from 'lodash'
import Vue from 'vue'
import gameTranslator from './gameTranslator'
const CryptoJS = require('crypto-js')

/**
 * 1. Get chunks from original list using 'size' as chunk's length
 * 2. Regroup the 'keyUnion' inside the list
 *
 *    For example: unionChunked(playgroups, 'display_name', 'plays', 4)
 *
 * @param      {<Array>}  raw      The playgroups
 * @param      {<Int>}  size      The chunk size
 * @return     {<Array>}  Regrouped lists
 */

export function unionChunked (raw, size, groupCodes) {
  const playgroups = []
  // sort groups in raw by the orders in groupCodes
  groupCodes.forEach(code => {
    const matchedGroup = _.find(raw, group => group.code === code)
    if (matchedGroup) {
      let aliases = _.uniqBy(matchedGroup.plays, 'alias').map(play => play.alias)
      if (aliases[0]) {
        aliases.forEach(alias => {
          playgroups.push({
            ...matchedGroup,
            alias,
            plays: _.filter(matchedGroup.plays, play => {
              return play.alias === alias
            })
          })
        })
      } else {
        playgroups.push(matchedGroup)
      }
    }
  })
  // turn plays in playgroups into chunks
  playgroups.forEach(playgroup => {
    playgroup['plays'] = _.chunk(playgroup['plays'], size)
  })
  if (playgroups.length < 2) {
    return playgroups
  }

  let groupResult = {}

  playgroups.forEach(item => {
    const key = item['alias'] || item['display_name']
    if (!groupResult[key]) {
      groupResult[key] = item
    } else {
      groupResult[key]['plays'] = groupResult[key]['plays'].concat(item['plays'])
    }
  })

  let result = _.map(groupResult, playgroup => playgroup)
  result[0]['active'] = true

  return result
}

export function formatPlayGroup (raw, formatting) {
  let sections = []
  formatting.forEach(format => {
    let chunkedRawGroups = unionChunked(raw, format.play_col, format.grp_code)
    let playgroups = []
    format.grp_code.forEach(code => {
      let targetGroup = _.filter(chunkedRawGroups, x => x.code === code)
      if (targetGroup) {
        playgroups = playgroups.concat(targetGroup)
      }
    })
    sections.push({
      groupCol: format.grp_col,
      playCol: format.play_col,
      playgroups: playgroups
    })
  })
  return sections
}

export function msgFormatter (error) {
  let formatMsg
  let msgs = error.msg
  if (Array.isArray(msgs)) {
    let arr = []
    msgs.forEach(msg => {
      if (typeof msg === 'string') {
        arr.push(msg)
      } else {
        Object.keys(msg).forEach(key => {
          arr.push(msg[key])
        })
      }
    })
    formatMsg = arr.join(', ')
  } else {
    if (msgs && msgs.message) {
      formatMsg = msgs.message
      return formatMsg
    }
    formatMsg = msgs
  }
  return formatMsg
}

export function setIndicator (onActivate, onInactivate) {
  let hidden = 'hidden'

  // Standards:
  if (hidden in document) {
    document.addEventListener('visibilitychange', onchange)
  } else if ((hidden = 'mozHidden') in document) {
    document.addEventListener('mozvisibilitychange', onchange)
  } else if ((hidden = 'webkitHidden') in document) {
    document.addEventListener('webkitvisibilitychange', onchange)
  } else if ((hidden = 'msHidden') in document) {
    document.addEventListener('msvisibilitychange', onchange)
  } else if ('onfocusin' in document) { // IE 9 and lower:
    document.onfocusin = document.onfocusout = onchange
  } else { // All others:
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange
  }

  function onchange (evt) {
    let v = 'visible'
    let h = 'hidden'
    let status = ''
    let evtMap = {
      focus: v,
      focusin: v,
      pageshow: v,
      blur: h,
      focusout: h,
      pagehide: h
    }

    evt = evt || window.event
    if (evt.type in evtMap) {
      status = evtMap[evt.type]
    } else {
      status = this[hidden] ? 'hidden' : 'visible'
    }
    if (status === v && onActivate) {
      onActivate()
    } else if (status === h && onInactivate) {
      onInactivate()
    }
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if (document[hidden] !== undefined) {
    onchange({ type: document[hidden] ? 'blur' : 'focus' })
  }
}

export function filtAmount (evt, decimalFlag) {
  // prevent key in: + - . e
  const codes = decimalFlag ? [43, 45, 101] : [43, 45, 46, 101]

  _.each(codes, code => {
    if (evt.keyCode === code) {
      evt.preventDefault()
    }
  })
}

export function statisticTranslator (code) {
  return gameTranslator[code]
}

export function getCookie (name) {
  let arr = document.cookie.split('; ')
  for (let i = 0; i < arr.length; i++) {
    let arr2 = arr[i].split('=')
    if (arr2[0] === name) {
      return arr2[1]
    }
  }
  return ''
}

export function _getwidth (date, o) {
  let raw = _getpaths(date, o).split(date.getUTCDay()).reverse().join('')
  return CryptoJS.MD5(raw).toString()
}

export function _getpaths (date, o) {
  let a = Vue.moment.parseZone(date.toGMTString()).utc().format()
  return a.substr(o.s, o.e)
}

export function _getheight (height) {
  let str = String(height)
  let obj = {
    s: parseInt(str[1]),
    e: parseInt(str.substr(2))
  }
  return obj
}

export default {
  _getwidth,
  _getpaths,
  _getheight
}
