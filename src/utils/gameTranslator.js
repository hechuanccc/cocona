const ranking = ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名']
const ballnum = ['第一球', '第二球', '第三球', '第四球', '第五球', '第六球', '第七球', '第八球']
const number = ['正码一', '正码二', '正码三', '正码四', '正码五', '正码六', '特码']

const transformerTranslator = function (title) {
  for (let i = 1; i < 11; i++) {
    if (`${i}` === title || `ball_than_size_${i}` === title || `ball_odd_even_${i}` === title) {
      return [ranking[i - 1]]
    }
  }
  switch (title) {
    case 'dragon_tiger_1_10':
      return ['冠军']
    case 'dragon_tiger_2_9':
      return ['亚军']
    case 'dragon_tiger_3_8':
      return ['第三名']
    case 'dragon_tiger_4_7':
      return ['第四名']
    case 'dragon_tiger_5_6':
      return ['第五名']
    case 'sum_of_1st_2st_than_size':
      return ['冠、亚军和']
    case 'sum_of_1st_2st_odd_even':
      return ['冠、亚军和']
    case 'sum_of_1st_2st':
      return ['冠、亚军和']
  }
  return ['']
}

const ssTranslator = function (title) {
  for (let i = 1; i < 6; i++) {
    if (`${i}` === title || `ball_than_size_${i}` === title || `ball_odd_even_${i}` === title) {
      return [ballnum[i - 1]]
    }
  }
  switch (title) {
    case 'dragon_tiger_1_5':
      return ['第一球']
    case 'sum_of_ball_odd_even':
      return ['总和']
    case 'sum_of_ball_than_size':
      return ['总和']
    case 'weird_chinese_dice_rules_1_3':
      return ['前三']
    case 'weird_chinese_dice_rules_2_4':
      return ['中三']
    case 'weird_chinese_dice_rules_3_5':
      return ['后三']
  }
  return ['']
}
const cqlfTranslator = function (title) {
  for (let i = 1; i < 9; i++) {
    if (`${i}` === title || `ball_than_size_${i}` === title || `ball_odd_even_${i}` === title || `ball_mahjong_eswn_${i}` === title || `ball_mahjong_zfb_${i}` === title) {
      return [ballnum[i - 1]]
    }
    if (`ball_of_sum_number_odd_even_${i}` === title) {
      return [ballnum[i - 1], 'sum']
    }
    if (`ball_tail_than_size_${i}` === title) {
      return [ballnum[i - 1], 'tail']
    }
  }
  switch (title) {
    case 'dragon_tiger_1_8':
      return ['第一球']
    case 'dragon_tiger_2_7':
      return ['第二球']
    case 'dragon_tiger_3_6':
      return ['第三球']
    case 'dragon_tiger_4_5':
      return ['第四球']
    case 'sum_of_ball_odd_even':
      return ['总和']
    case 'sum_of_ball_than_size':
      return ['总和']
    case 'sum_of_ball_tail_than_size':
      return ['总和', 'tail']
  }
  return ['']
}
const gd11x5Translator = function (title) {
  for (let i = 1; i < 6; i++) {
    if (`${i}` === title || `ball_than_size_${i}` === title || `ball_odd_even_${i}` === title) {
      return [ballnum[i - 1]]
    }
  }
  switch (title) {
    case 'sum_of_ball_odd_even':
      return ['总和']
    case 'sum_of_ball_than_size':
      return ['总和']
    case 'sum_of_ball_tail_than_size':
      return ['总和', 'tail']
    case 'dragon_tiger_1_5':
      return ['第一球']
  }
  return ['']
}

const bjkl8Translator = function (title) {
  switch (title) {
    case 'sum_of_ball_odd_even':
      return ['总和']
    case 'sum_of_ball_than_size':
      return ['总和']
    case 'sum_of_ball_five_element':
      return ['五行']
    case 'balls_front_rear_count_cp':
      return ['前后和']
    case 'balls_odd_even_cp':
      return ['单双和']
  }
  return ['']
}
const auluck8Translator = function (title) {
  for (let i = 1; i < 21; i++) {
    if (`${i}` === title || `ball_than_size_${i}` === title || `ball_odd_even_${i}` === title) {
      return [`第${i}球`]
    }
  }
  switch (title) {
    case 'sum_of_ball_odd_even':
      return ['总和']
    case 'sum_of_ball_than_size':
      return ['总和']
    case 'sum_of_ball_five_element':
      return ['五行']
  }
  return ['']
}

const auluck8StatisticTranslator = function (title) {
  switch (title) {
    case 'sum_of_ball_odd_even':
      return ['总和']
    case 'sum_of_ball_than_size':
      return ['总和']
    case 'sum_of_ball_five_element':
      return ['五行']
  }
  return ['']
}

const pcddTranslator = function (title) {
  switch (title) {
    case 'sum_of_ball_odd_even':
      return ['总和']
    case 'sum_of_ball_than_size':
      return ['总和']
    case 'sum_of_ball_color_wavelength':
      return ['总和']
  }
  return ['']
}
const hklTranslator = function (title) {
  for (let i = 1; i < 8; i++) {
    if (`ball_than_size_${i}` === title || `ball_odd_even_${i}` === title || `ball_five_element_${i}` === title || `ball_chinese_zodiac_${i}` === title || `ball_color_wavelength_${i}` === title) {
      return [number[i - 1]]
    }
    if (`ball_tail_than_size_${i}` === title) {
      return [number[i - 1], 'tail']
    }
    if (`ball_of_sum_number_odd_even_${i}` === title) {
      return [number[i - 1], 'sum']
    }
    if (`ball_of_sum_number_than_size_${i}` === title) {
      return [number[i - 1], 'sum']
    }
  }
  switch (title) {
    case 'sum_of_ball_than_size':
      return ['总和']
    case 'sum_of_ball_odd_even':
      return ['总和']
    case 'seven_color_wavelength':
      return ['七色波']
  }
  return ['']
}
const jsk3Translator = function (title) {
  switch (title) {
    case 'sum_of_ball_than_size':
      return ['总和']
  }
  return ['']
}
const fc3dTranslator = function (title) {
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      switch (title) {
        case 'balls_odd_even_1_2':
          return ['佰拾和數']
        case 'balls_than_size_1_2':
          return ['佰拾和數']
        case 'balls_prime_composite_tail_1_2':
          return ['佰拾和數', 'tail']
        case 'balls_than_size_tail_1_2':
          return ['佰拾和數', 'tail']
        case 'balls_odd_even_1_3':
          return ['佰个和數']
        case 'balls_than_size_1_3':
          return ['佰个和數']
        case 'balls_prime_composite_tail_1_3':
          return ['佰个和數', 'tail']
        case 'balls_than_size_tail_1_3':
          return ['佰个和數', 'tail']
        case 'balls_odd_even_2_3':
          return ['拾个和數']
        case 'balls_than_size_2_3':
          return ['拾个和數']
        case 'balls_prime_composite_tail_2_3':
          return ['拾个和數', 'tail']
        case 'balls_than_size_tail_2_3':
          return ['拾个和數', 'tail']
      }
    }
  }
  switch (title) {
    case 'sum_of_ball_odd_even':
      return ['佰拾个和數']
    case 'sum_of_ball_than_size':
      return ['佰拾个和數']
    case 'sum_of_ball_prime_composite':
      return ['佰拾个和數']
    case 'sum_of_ball_tail_than_size':
      return ['佰拾个和數', 'tail']
    case 'sum_of_ball_tail_prime_composite':
      return ['佰拾个和數', 'tail']
  }
  return ['']
}

export default {
  'jspk10': transformerTranslator,
  'bcr': transformerTranslator,
  'mlaft': transformerTranslator,
  'er75ft': transformerTranslator,
  'cqssc': ssTranslator,
  'jsssc': ssTranslator,
  'xjssc': ssTranslator,
  'tjssc': ssTranslator,
  'cqlf': cqlfTranslator,
  'gdklsf': cqlfTranslator,
  'gd11x5': gd11x5Translator,
  'bjkl8': bjkl8Translator,
  'auluck8': auluck8Translator,
  'auluck8Statistic': auluck8StatisticTranslator,
  'pcdd': pcddTranslator,
  'jnd28': pcddTranslator,
  'hkl': hklTranslator,
  'jsk3': jsk3Translator,
  'fc3d': fc3dTranslator
}
