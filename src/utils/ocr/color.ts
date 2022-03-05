export const rgbToHex = (rgb: [number, number, number]) => {
  return rgb.reduce((acc, cur) => {
    const v = cur.toString(16)
    if (v.length === 1) return acc + '0' + v
    return acc + v
  }, '#')
}

export const hexToRgb = (hex: string) => {
  const h = hex.startsWith('#') ? hex.substring(1) : hex
  if (h.length === 3) {
    return h.split('').map(v => {
      return parseInt(`${v}${v}`, 16)
    })
  } else if (h.length === 6) {
    return h.match(/.{1,2}/g)!.map(v => {
      return parseInt(v, 16)
    })
  } else {
    throw new Error('Invalid hex input')
  }
}

export const distance = (c1: number[], c2: number[]) => {
  if (c1.length !== c2.length) throw new Error('Input arrays are not of equal lengths')
  const sum = [...c1]
    .map((v, i) => {
      return Math.pow(v - c2[i], 2)
    })
    .reduce((acc, cur) => {
      return acc + cur
    })
  return Math.sqrt(sum)
}
