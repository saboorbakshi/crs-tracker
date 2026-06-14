export const CHART_ASPECT_RATIO = 1.9

export const POOL_RANGES = [
  { key: 'dd1', range: '601-1200' },
  { key: 'dd2', range: '501-600' },
  { key: 'dd3', range: '451-500' },
  { key: 'dd4', range: '491-500' },
  { key: 'dd5', range: '481-490' },
  { key: 'dd6', range: '471-480' },
  { key: 'dd7', range: '461-470' },
  { key: 'dd8', range: '451-460' },
  { key: 'dd9', range: '401-450' },
  { key: 'dd10', range: '441-450' },
  { key: 'dd11', range: '431-440' },
  { key: 'dd12', range: '421-430' },
  { key: 'dd13', range: '411-420' },
  { key: 'dd14', range: '409-410' },
  { key: 'dd15', range: '351-400' },
  { key: 'dd16', range: '301-350' },
  { key: 'dd17', range: '0-300' },
]

export const POOL_VIEWS = {
  Compact: ['dd17', 'dd16', 'dd15', 'dd9', 'dd3', 'dd2', 'dd1'],
  Detailed: [
    'dd17',
    'dd16',
    'dd15',
    'dd14',
    'dd13',
    'dd12',
    'dd11',
    'dd10',
    'dd8',
    'dd7',
    'dd6',
    'dd5',
    'dd4',
    'dd2',
    'dd1',
  ],
} as const

export const PERIODS = ['ALL', '2Y', '1Y']

export const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
export const FULL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
