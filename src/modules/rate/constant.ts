const artifactsEnum = {
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
}

const artifactsMap = new Map<string, string>()
Object.keys(artifactsEnum).forEach(key => {
  artifactsMap.set(key, artifactsEnum[key])
})
