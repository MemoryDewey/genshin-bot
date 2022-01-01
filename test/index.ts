import { genRatedImage } from '../src/modules/rate/uitl'

genRatedImage(
  {
    name: '角斗士的酣醉',
    pos: '空之杯',
    star: 5,
    level: 20,
    main_item: { type: 'pyro', name: '火元素伤害加成', value: '46.6%' },
    sub_item: [
      { type: 'atk', name: '攻击力', value: '16.3%' },
      { type: 'cr', name: '暴击率', value: '2.7%' },
      { type: 'cd', name: '暴击伤害', value: '20.2%' },
      { type: 'atk', name: '攻击力', value: '29' },
    ],
  },
  { main: 90, sub: 10, total: 100 },
)
