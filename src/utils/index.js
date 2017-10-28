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

export function unionChunked (list, keyBy, keyUnion, size) {
  list.forEach(item => {
    item.plays = _.chunk(item[keyUnion], 4)
  })
  if (list.length < 2) {
    return list
  }

  let obj = {}

  list.forEach(item => {
    if (!obj[item[keyBy]]) {
      obj[item[keyBy]] = item
    } else {
      obj[item[keyBy]][keyUnion] = obj[item[keyBy]][keyUnion].concat(item[keyUnion])
    }
  })
  return _.map(obj, n => n)
}
