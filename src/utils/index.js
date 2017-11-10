import _ from 'lodash'

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
      playgroups.push(matchedGroup)
    }
  })

  // turn plays in playgroups into chunks
  playgroups.forEach(playgroup => {
    playgroup['plays'] = _.chunk(playgroup['plays'], size)
  })
  if (playgroups.length < 2) {
    return playgroups
  }

  let obj = {}

  playgroups.forEach(item => {
    if (!obj[item['display_name']]) {
      obj[item['display_name']] = item
    } else {
      obj[item['display_name']]['plays'] = obj[item['display_name']]['plays'].concat(item['plays'])
    }
  })
  return _.map(obj, n => n)
}

export function formatPlayGroup (raw, formatting) {
  let sections = []
  formatting.forEach(format => {
    let chunkedRaw = unionChunked(raw, format.play_col, format.grp_code)
    let playgroups = []
    format.grp_code.forEach(code => {
      let targetGroup = _.find(chunkedRaw, x => x.code === code)
      if (targetGroup) {
        playgroups.push(targetGroup)
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

export function msgFormatter (msgs) {
  let formatMsg
  if (Array.isArray(msgs)) {
    let arr = []

    msgs.forEach(msg => {
      Object.keys(msg).forEach(key => {
        arr.push(msg[key])
      })
    })
    formatMsg = arr.join(', ')
  } else {
    formatMsg = msgs
  }
  return formatMsg
}
