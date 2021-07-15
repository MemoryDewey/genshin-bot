export interface DataItem {
  total: string
  size: string
  page: string
  list: Array<ListItem>
  region: string
}

export interface ListItem {
  uid: string
  item_id: string
  item_type: string
  count: string
  name: string
  gacha_type: string
  time: string
  id: string
  lang: string
  rank_type: string
}

export interface WishRes {
  data: DataItem
  message: string
  retcode: number
}
