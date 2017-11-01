import _ from 'lodash'

/**
 * 1. Get chunks from original list using 'size' as chunk's length
 * 2. Regroup the 'keyUnion' inside the list
 *
 *    For example: unionChunked(playgroups, 'display_name', 'plays', 4)
 *
 * @param      {<Array>}  raw      The playgroups
 * @param      {<String>}  keyBy     Which field do we use to decide the
 *             item should be in the same group.
 * @param      {<String>}  keyUnion  Which field do we want to union.
 * @param      {<Int>}  size      The chunk size
 * @return     {<type>}  Regrouped lists
 */

export function unionChunked (raw, keyBy, keyUnion, size) {
  const playgroups = _.cloneDeep(raw)
  playgroups.forEach(playgroup => {
    playgroup[keyUnion] = _.chunk(playgroup[keyUnion], size)
  })
  if (playgroups.length < 2) {
    return playgroups
  }
  let obj = {}

  playgroups.forEach(item => {
    if (!obj[item[keyBy]]) {
      obj[item[keyBy]] = item
    } else {
      obj[item[keyBy]][keyUnion] = obj[item[keyBy]][keyUnion].concat(item[keyUnion])
    }
  })
  return _.map(obj, n => n)
}

export function formatPlayGroup (raw, formatting) {
  let sections = []
  formatting.forEach(format => {
    let chunkedRaw = unionChunked(raw, 'display_name', 'plays', format.play_col)
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
