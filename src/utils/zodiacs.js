export const zodiacs = [
  {
    xiao: '鼠',
    nums: '10,22,34,46',
    englishName: 'RAT'
  },
  {
    xiao: '牛',
    nums: '09,21,33,45',
    englishName: 'OX'
  },
  {
    xiao: '虎',
    nums: '08,20,32,44',
    englishName: 'TIGER'
  },
  {
    xiao: '兔',
    nums: '07,19,31,43',
    englishName: 'RABBIT'
  },
  {
    xiao: '龙',
    nums: '06,18,30,42',
    englishName: 'DRAGON'
  },
  {
    xiao: '蛇',
    nums: '05,17,29,41',
    englishName: 'SNAKE'
  },
  {
    xiao: '马',
    nums: '04,16,28,40',
    englishName: 'HORSE'
  },
  {
    xiao: '羊',
    nums: '03,15,27,39',
    englishName: 'SHEEP'
  },
  {
    xiao: '猴',
    nums: '02,14,26,38',
    englishName: 'MONKEY'
  },
  {
    xiao: '鸡',
    nums: '01,13,25,37,49',
    englishName: 'ROOSTER'
  },
  {
    xiao: '狗',
    nums: '12,24,36,48',
    englishName: 'DOG'
  },
  {
    xiao: '猪',
    nums: '11,23,35,47',
    englishName: 'PIG'
  }
]

const zodiacTranslater = {}
zodiacs.forEach(
  zodiac => {
    zodiacTranslater[zodiac.englishName] = zodiac.xiao
  }
)
export const zodiacMap = zodiacTranslater
