import { GachaInfo } from './constant'
import { Http, pause, writeFile } from 'src/utils'
import { ListItem, WishRes } from 'src/interfaces/wish'
import { join, resolve } from 'path'
import { DATA_PATH, ROOT_PATH } from 'framework/config'
import FileAsync from 'lowdb/adapters/FileAsync'
import low from 'lowdb'
import { createCanvas, loadImage, registerFont } from 'canvas'
import { readFileSync } from 'fs'

export async function fetchGachaInfo(
  name: keyof typeof GachaInfo,
  http: Http,
  qq: number,
  params: Record<string, any>,
) {
  let gacha_type = 0
  switch (name) {
    case '新手':
      gacha_type = GachaInfo.新手
      break
    case '常驻':
      gacha_type = GachaInfo.常驻
      break
    case '角色':
      gacha_type = GachaInfo.角色
      break
    case '武器':
      gacha_type = GachaInfo.武器
      break
  }

  // 每个用户创建一个DB
  const adapter = new FileAsync(resolve(ROOT_PATH, `./src/database/wish/${qq}.json`))
  const userDb = await low(adapter)

  const dbRes = (await userDb.get(name).value()) as ListItem[]
  // 已经在db中储存了数据
  const hadData = dbRes && dbRes.length > 0

  params = {
    ...params,
    gacha_type,
    size: 20,
  }

  let result: ListItem[] = hadData ? dbRes : []

  let page = 1

  const fetch = async (id?: string) => {
    const p: Record<string, any> = { ...params, gacha_type, size: 20 }
    page++
    if (!hadData) {
      p.end_id = id
    } else {
      // 如果储存过数据
      // 从db中数据的最后一个(最新数据的id)开始查询
      p.begin_id = id
    }
    // 每获取100个数据暂停 1s
    if (page % 5 == 0) {
      await pause(1000)
    }
    const { data } = await http.get<WishRes>('/event/gacha_info/api/getGachaLog', p)
    if (data.retcode != 0) {
      return false
    }
    const list = data.data.list
    // 往前查询应该把最新的放在数组最前
    if (hadData) {
      result = list.concat(result)
    } else {
      result = result.concat(list)
    }
    if (data.data.list.length == 20) {
      await pause(200)
      // 查询过就用第一个的id往前查
      // 否则拿最后一个的id往后查
      const tempId = hadData ? list[0].id : list[list.length - 1].id
      await fetch(tempId)
    }
    return true
  }

  // 查询过使用最新的id往前查
  const fetchId = hadData ? dbRes[0].id : undefined
  const isExpire = !(await fetch(fetchId))

  userDb.set(name, result).write()
  return { isExpire, result }
}

export async function generateGachaImg(
  qq: number,
  name: keyof typeof GachaInfo,
  items: ListItem[],
) {
  // 金卡
  const goldIndexArr: number[] = []
  const goldCards = items.filter((value, index) => {
    if (value.rank_type == '5') {
      goldIndexArr.push(index)
    }
    return value.rank_type == '5'
  })
  const goldMap = new Map<string, { type: string; count: number }>()
  const firstGoldIndex = items.findIndex(value => value.rank_type == '5')
  goldCards.forEach(value => {
    const res = goldMap.get(value.name)
    goldMap.set(
      value.name,
      res != undefined
        ? { type: value.item_type, count: res.count + 1 }
        : { type: value.item_type, count: 0 },
    )
  })
  // 获取本命五星
  const goldCardsMapArr = Array.from(goldMap).sort((a, b) => b[1].count - a[1].count)

  // 开始画图
  const canvas = createCanvas(420, 210 + 24 * Math.ceil(goldCards.length / 5))
  const fontPath = join(ROOT_PATH, './src/assets/font/Hans.ttf')
  registerFont(fontPath, { family: 'Hans' })
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // title
  ctx.font = '30px Hans'
  ctx.fillStyle = '#676767'
  ctx.fillText(`${name}池`, 12, 42)
  // border-bottom
  ctx.fillRect(0, 58, 420, 1)
  // content
  ctx.font = '18px Hans'
  ctx.fillText('本命五星:', 12, 90)
  if (goldCardsMapArr.length) {
    try {
      const g = goldCardsMapArr[0]
      const gN = g[1].type == '角色' ? 'characters' : 'weapons'
      const path = join(ROOT_PATH, `./src/assets/images/${gN}`, `./${g[0]}.png`)
      const file = readFileSync(path)
      const img = await loadImage(file)
      ctx.drawImage(img, 12, 102, 80, 80)
    } catch (e) {
      console.log(e)
    }
  }
  // center count
  ctx.fillText(`总抽卡数 : ${items.length}`, 150, 120)
  ctx.fillText(`金卡数 : ${goldCards.length}`, 150, 138)
  ctx.fillText(`平均 ${(items.length / goldCards.length).toFixed(2)} 抽出金`, 150, 156)
  ctx.fillText(
    `已 ${firstGoldIndex == -1 ? items.length : firstGoldIndex} 抽未出金`,
    150,
    174,
  )
  // gold card
  ctx.font = '16px Hans'
  const xStart = 12
  const len = goldCards.length
  let line = 0
  let width = xStart
  goldCards.reverse().forEach((value, index) => {
    let getGoldIndex: number
    if (index == 0) {
      getGoldIndex = items.length - goldIndexArr[len - 1] - 1
    } else {
      const now = goldIndexArr[len - index - 1]
      const pre = goldIndexArr[len - index]
      getGoldIndex = pre - now
    }
    const text = `${value.name}[${getGoldIndex}] `
    const wid = ctx.measureText(text).width
    if (width + wid > canvas.width - 16) {
      width = xStart
      line++
    }
    ctx.fillText(text, width, 205 + line * 20)
    width += wid
  })

  writeFile(
    join(DATA_PATH, `/images/genshin/${qq}/wish`),
    `${name}.png`,
    canvas.toBuffer('image/png', { compressionLevel: 9 }),
  )
}
