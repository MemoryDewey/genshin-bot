import { readJsonFile } from 'src/utils'
import path from 'path'

type Almanac = {
  [key: string]: {
    buff: string[]
    debuff: string[]
  }
}

const listData = readJsonFile<Almanac>(path.join(__dirname, 'almanac-list.json'))

/**
 * 使用随机种子随机选择列表中的元素，相同的种子和列表将返回同样的输出
 * @param arr
 */
function seedRandomList(arr: string[]) {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}
