import { Marvin, MarvinImage } from 'lib/marvinj'
import { COLORS } from '../data/color'
import { distance, hexToRgb } from '../color'

export type Rarity = 1 | 2 | 3 | 4 | 5 | '1' | '2' | '3' | '4' | '5'

// guess stars based on average color
const guessRarity = (imageIn: MarvinImage): Rarity => {
  const width = imageIn.getWidth()
  const height = imageIn.getHeight()
  const cropImg = new MarvinImage(width, height)
  Marvin.crop(imageIn, cropImg, 0, 0, width, Math.ceil(height / 2))
  const avgColor: [number, number, number] = Marvin.averageColor(cropImg)
  const min = Object.entries(COLORS).reduce(
    (acc, [key, val]) => {
      const dist = distance(avgColor, hexToRgb(val))
      if (dist < acc[1]) return [key, dist]
      return acc
    },
    ['', Infinity],
  )
  return min[0] as Rarity
}

export default guessRarity
