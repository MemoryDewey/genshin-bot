// guess enhancement level based on main stat value
import { Rarity } from './guessRarity'
import { mainStatsData } from '../data/stats'

const guessEnhancement = (statVal: number, rarity: Rarity, statKey?: string): number => {
  const data = mainStatsData[rarity]
  const poss = Object.values(data).find(statArray => statArray.includes(statVal))
  if (poss) {
    return poss.indexOf(statVal)
  }
  return 0 // defaults to 0
}

export default guessEnhancement
