const artifactsEnum = {
  archaicPetra: '悠古的磐岩',
  blizzardStrayer: '冰风迷途的勇士',
  bloodstainedChivalry: '染血的骑士道',
  crimsonWitch: '炽烈的炎之魔女',
}

const artifactsMap = new Map<string, string>()
Object.keys(artifactsEnum).forEach(key => {
  artifactsMap.set(key, artifactsEnum[key])
})
