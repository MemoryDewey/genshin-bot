export const hammingDistance = (str1: string, str2: string) => {
  let dist = 0
  str1 = str1.toLowerCase()
  str2 = str2.toLowerCase()

  for (let i = 0, j = Math.max(str1.length, str2.length); i < j; i++) {
    let match = true
    if (!str1[i] || !str2[i] || str1[i] !== str2[i]) match = false
    if (str1[i - 1] === str2[i] || str1[i + 1] === str2[i]) match = true
    if (!match) dist++
  }
  return dist
}
