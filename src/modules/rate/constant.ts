/*const artifactsEnum = {
  archaicPetra: '悠古的磐岩',
  blizzardStrayer: '冰风迷途的勇士',
  bloodstainedChivalry: '染血的骑士道',
  crimsonWitch: '炽烈的炎之魔女',
  gladiatorFinale: '角斗士的终幕礼',
  heartOfDepth: '沉沦之心',
  lavaWalker: '渡过烈火的贤人',
  maidenBeloved: '被怜爱的少女',
  noblesseOblige: '昔日宗室之仪',
  paleFlame: '苍白之火',
  retracingBolide: '逆飞的流星',
  tenacityOfTheMillelith: '千岩牢固',
  thunderingFury: '如雷的盛怒',
  thunderingSmoother: '平息鸣雷的尊者',
  viridescentVenerer: '翠绿之影',
  wandererTroupe: '流浪大地的乐团',
}*/

/**
 * 圣遗物主词条最大值
 */
export enum MainPercentMaxProp {
  cr = 31.1,
  cd = 62.2,
  atk = 46.6,
  hp = 46.6,
  df = 58.3,
  er = 51.8,
  phys = 58.3,
  pyro = 46.6,
  hydro = 46.6,
  elec = 46.6,
  geo = 46.6,
  anemo = 46.6,
  cryo = 46.6,
  heal = 35.9,
}
export enum MainNumberMaxProp {
  atk = 311,
  hp = 4780,
  em = 187,
}

/**
 * 圣遗物主词条权重比
 * 按照圣遗物 Rate:Weight 来算
 * eg. 1权重 = 2暴击伤害
 */
export enum MainPercentWeightRate {
  cr = 1,
  cd = 2,
  atk = 1.498392,
  hp = 1.498392,
  df = 1.874598,
  er = 1.665594,
  phys = 1.874598,
  pyro = 1.498392,
  hydro = 1.498392,
  elec = 1.498392,
  geo = 1.498392,
  anemo = 1.498392,
  cryo = 1.498392,
  heal = 1.15434,
}
export enum MainNumberWeightRate {
  atk = 10,
  hp = 153.697749,
  em = 6.012861,
}

/**
 * 圣遗物副词条最大值
 */
export enum SubPercentMaxProp {
  cr = 23.4,
  cd = 46.8,
  atk = 34.8,
  hp = 34.8,
  df = 43.8,
  er = 39,
}
export enum SubNumberMaxProp {
  atk = 114,
  hp = 1794,
  df = 138,
  em = 138,
}

/**
 * 圣遗物副词条权重比
 */
export enum SubPercentWeightRate {
  cr = 1,
  cd = 2,
  atk = 1.487179,
  hp = 1.487179,
  df = 1.871794,
  er = 1.239316,
}
export enum SubNumberWeightRate {
  atk = 4.871794,
  hp = 76.666666,
  df = 5.897435,
  em = 5.897435,
}
