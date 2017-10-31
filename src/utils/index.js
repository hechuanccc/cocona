import _ from 'lodash'

/**
 * 1. Get chunks from original list using 'size' as chunk's length
 * 2. Regroup the 'keyUnion' inside the list
 *
 *    For example: unionChunked(playgroups, 'display_name', 'plays', 4)
 *
 * @param      {<Array>}  list      The list
 * @param      {<String>}  keyBy     Which field do we use to decide the
 *           item should be in the same group.
 * @param      {<String>}  keyUnion  Which field do we want to union.
 * @param      {<Int>}  size      The chunk size
 * @return     {<type>}  Regrouped lists
 */

export function unionChunked (raw, keyBy, keyUnion, size) {
  const list = _.cloneDeep(raw)
  list.forEach(item => {
    console.log(Array.isArray(item.plays[0][0]))
    item[keyUnion] = _.chunk(item[keyUnion], size)
    console.log(Array.isArray(item.plays[0][0]))
  })
  if (list.length < 2) {
    return list
  }
  console.log(list)
  let obj = {}

  list.forEach(item => {
    if (!obj[item[keyBy]]) {
      obj[item[keyBy]] = item
    } else {
      console.log(obj[item[keyBy]][keyUnion])
      obj[item[keyBy]][keyUnion] = obj[item[keyBy]][keyUnion].concat(item[keyUnion])
    }
  })
  console.log(obj)
  return _.map(obj, n => n)
}

export function formatPlayGroup (raw, formatting) {
  console.log(raw, formatting)
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
