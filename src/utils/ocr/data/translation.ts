export type Language = 'chs' | 'eng'

export interface ArtifactSet {
  flower?: string
  plume?: string
  sands?: string
  goblet?: string
  circlet: string
}

export const statRef = {
  atk: { chs: '攻击力', eng: 'ATK' },
  hp: { chs: '生命值', eng: 'HP' },
  def: { chs: '防御力', eng: 'DEF' },
  eleMas: { chs: '元素精通', eng: 'Elemental Mastery' },
  energyRecharge: { chs: '元素充能效率', eng: 'Energy Recharge' },
  healBonus: { chs: '治疗加成', eng: 'Heal Bonus' },
  critRate: { chs: '暴击率', eng: 'Critical Rate' },
  critDmg: { chs: '暴击伤害', eng: 'Critical Damage' },
  physicalDmg: { chs: '物理伤害加成', eng: 'Physical Damage' },
  anemoDmg: { chs: '风元素伤害加成', eng: 'Anemo Damage' },
  geoDmg: { chs: '岩元素伤害加成', eng: 'Geo Damage' },
  electroDmg: { chs: '雷元素伤害加成', eng: 'Electro Damage' },
  hydroDmg: { chs: '水元素伤害加成', eng: 'Hydro Damage' },
  pyroDmg: { chs: '火元素伤害加成', eng: 'Pyro Damage' },
  cryoDmg: { chs: '冰元素伤害加成', eng: 'Cryo Damage' },
  dendroDmg: { chs: '草元素伤害加成', eng: 'Dendro Damage' },
}

export type StatKey = keyof typeof statRef

export const elementsRef = {
  physical: { chs: '物理', eng: 'Physical' },
  anemo: { chs: '风元素', eng: 'Anemo' },
  geo: { chs: '岩元素', eng: 'Geo' },
  electro: { chs: '雷元素', eng: 'Electro' },
  hydro: { chs: '水元素', eng: 'Hydro' },
  pyro: { chs: '火元素', eng: 'Pyro' },
  cryo: { chs: '冰元素', eng: 'Cryo' },
  dendro: { chs: '草元素', eng: 'Dendro' },
}

export const pieceRef: Record<string, ArtifactSet> = {
  echoesOfAnOffering: {
    flower: '魂香之花',
    plume: '垂玉之叶',
    sands: '祝祀之凭',
    goblet: '涌泉之盏',
    circlet: '浮溯之珏',
  },
  vermillionHereafter: {
    flower: '生灵之华',
    plume: '潜光片羽',
    sands: '阳辔之遗',
    goblet: '结契之刻',
    circlet: '虺雷之姿',
  },
  oceanHuedClam: {
    flower: '海染之花',
    plume: '渊宫之羽',
    sands: '离别之贝',
    goblet: '真珠之笼',
    circlet: '海祇之冠',
  },
  huskOfOpulentDreams: {
    flower: '荣花之期',
    plume: '华馆之羽',
    sands: '众生之谣',
    goblet: '梦醒之瓢',
    circlet: '形骸之笠',
  },
  emblemOfSeveredFate: {
    flower: '明威之镡',
    plume: '切落之羽',
    sands: '雷云之笼',
    goblet: '绯花之壶',
    circlet: '华饰之兜',
  },
  shimenawaReminiscence: {
    flower: '羁缠之花',
    plume: '思忆之矢',
    sands: '朝露之时',
    goblet: '祈望之心',
    circlet: '无常之面',
  },
  tenacityOfTheMillelith: {
    flower: '勋绩之花',
    plume: '昭武翎羽',
    sands: '金铜时晷',
    goblet: '盟誓金爵',
    circlet: '将帅兜鍪',
  },
  paleFlame: {
    flower: '无垢之花',
    plume: '贤医之羽',
    sands: '停摆之刻',
    goblet: '超越之盏',
    circlet: '嗤笑之面',
  },
  archaicPetra: {
    flower: '磐陀裂生之花',
    plume: '嵯峨群峰之翼',
    sands: '星罗圭壁之晷',
    goblet: '巉岩琢塑之樽',
    circlet: '不动玄石之相',
  },
  blizzardStrayer: {
    flower: '历经风雪的思念',
    plume: '摧冰而行的执望',
    sands: '冰雪故园的终期',
    goblet: '遍结寒霜的傲骨',
    circlet: '破冰踏雪的回音',
  },
  bloodstainedChivalry: {
    flower: '染血的铁之心',
    plume: '染血的黑之羽',
    sands: '骑士染血之时',
    goblet: '染血骑士之杯',
    circlet: '染血的铁假面',
  },
  crimsonWitch: {
    flower: '魔女的炎之花',
    plume: '魔女常燃之羽',
    sands: '魔女破灭之时',
    goblet: '魔女的心之火',
    circlet: '焦灼的魔女帽',
  },
  gladiatorFinale: {
    flower: '角斗士的留恋',
    plume: '角斗士的归宿',
    sands: '角斗士的希冀',
    goblet: '角斗士的酣醉',
    circlet: '角斗士的凯旋',
  },
  heartOfDepth: {
    flower: '饰金胸花',
    plume: '追忆之风',
    sands: '坚铜罗盘',
    goblet: '沉波之盏',
    circlet: '酒渍船帽',
  },
  lavaWalker: {
    flower: '渡火者的决绝',
    plume: '渡火者的解脱',
    sands: '渡火者的煎熬',
    goblet: '渡火者的醒悟',
    circlet: '渡火者的智慧',
  },
  maidenBeloved: {
    flower: '远方的少女的心',
    plume: '少女飘摇的思念',
    sands: '少女苦短的良辰',
    goblet: '少女片刻的闲暇',
    circlet: '少女易逝的芳颜',
  },
  noblesseOblige: {
    flower: '宗室之花',
    plume: '宗室之翎',
    sands: '宗室时计',
    goblet: '宗室银瓮',
    circlet: '宗室面具',
  },
  retracingBolide: {
    flower: '夏祭之花',
    plume: '夏祭终末',
    sands: '夏祭之刻',
    goblet: '夏祭水玉',
    circlet: '夏祭之面',
  },
  thunderSmoother: {
    flower: '平雷之心',
    plume: '平雷之羽',
    sands: '平雷之刻',
    goblet: '平雷之器',
    circlet: '平雷之冠',
  },
  thunderingFury: {
    flower: '雷鸟的怜悯',
    plume: '雷灾的孑遗',
    sands: '雷霆的时计',
    goblet: '降雷的凶兆',
    circlet: '唤雷的头冠',
  },
  viridescentVenerer: {
    flower: '野花记忆的绿野',
    plume: '猎人青翠的箭羽',
    sands: '翠绿猎人的笃定',
    goblet: '翠绿猎人的容器',
    circlet: '翠绿的猎人之冠',
  },
  wandererTroupe: {
    flower: '乐团的晨光',
    plume: '琴师的箭羽',
    sands: '终幕的时计',
    goblet: '吟游者之壶',
    circlet: '指挥的礼帽',
  },
  berserker: {
    flower: '战狂的蔷薇',
    plume: '战狂的翎羽',
    sands: '战狂的时计',
    goblet: '战狂的骨杯',
    circlet: '战狂的鬼面',
  },
  braveHeart: {
    flower: '勇士的勋章',
    plume: '勇士的期许',
    sands: '勇士的坚毅',
    goblet: '勇士的壮行',
    circlet: '勇士的冠冕',
  },
  defenderWill: {
    flower: '守护之花',
    plume: '守护徽印',
    sands: '守护座钟',
    goblet: '守护之皿',
    circlet: '守护束带',
  },
  exile: {
    flower: '流放者之花',
    plume: '流放者之羽',
    sands: '流放者怀表',
    goblet: '流放者之杯',
    circlet: '流放者头冠',
  },
  gambler: {
    flower: '赌徒的胸花',
    plume: '赌徒的羽饰',
    sands: '赌徒的怀表',
    goblet: '赌徒的骰蛊',
    circlet: '赌徒的耳环',
  },
  instructor: {
    flower: '教官的胸花',
    plume: '教官的羽饰',
    sands: '教官的怀表',
    goblet: '教官的茶杯',
    circlet: '教官的帽子',
  },
  martialArtist: {
    flower: '武人的红花',
    plume: '武人的羽饰',
    sands: '武人的水漏',
    goblet: '武人的酒杯',
    circlet: '武人的头巾',
  },
  prayersForDestiny: { circlet: '祭水礼冠' },
  prayersForIllumination: { circlet: '祭火礼冠' },
  prayersForWisdom: { circlet: '祭雷礼冠' },
  prayersToSpringtime: { circlet: '祭冰礼冠' },
  resolutionOfSojourner: {
    flower: '故人之心',
    plume: '归乡之羽',
    sands: '逐光之石',
    goblet: '异国之盏',
    circlet: '感别之冠',
  },
  scholar: {
    flower: '学士的书签',
    plume: '学士的羽笔',
    sands: '学士的时钟',
    goblet: '学士的墨杯',
    circlet: '学士的镜片',
  },
  tinyMiracle: {
    flower: '奇迹之花',
    plume: '奇迹之羽',
    sands: '奇迹之沙',
    goblet: '奇迹之杯',
    circlet: '奇迹耳坠',
  },
  adventurer: {
    flower: '冒险家之花',
    plume: '冒险家尾羽',
    sands: '冒险家怀表',
    goblet: '冒险家金杯',
    circlet: '冒险家头带',
  },
  luckyDog: {
    flower: '幸运儿绿花',
    plume: '幸运儿鹰羽',
    sands: '幸运儿沙漏',
    goblet: '幸运儿之杯',
    circlet: '幸运儿银冠',
  },
  travelingDoctor: {
    flower: '游医的银莲',
    plume: '游医的枭羽',
    sands: '游医的怀钟',
    goblet: '游医的药壶',
    circlet: '游医的方巾',
  },
}

export type Slot = '空之杯' | '时之沙' | '生之花' | '死之羽' | '理之冠'
