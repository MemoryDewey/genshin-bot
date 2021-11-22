import { calcSubPropScore } from '../src/modules/rate/uitl'

console.log(
  calcSubPropScore(
    [
      {
        type: 'atk',
        name: '攻击力',
        value: '4.1%',
      },
      {
        type: 'cr',
        name: '暴击率',
        value: '3.9%',
      },
      {
        type: 'cd',
        name: '暴击伤害',
        value: '33.4%',
      },
      {
        type: 'df',
        name: '防御力',
        value: '23',
      },
    ],
    'pyro',
    '空之杯',
  ),
)
