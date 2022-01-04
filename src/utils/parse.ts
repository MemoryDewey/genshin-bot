import { parse } from 'querystring'

export function decodeHTML(str: string) {
  return str.replace(/&lt;|&gt;|&amp;/g, matches => {
    return { '&lt;': '<', '&gt;': '>', '&amp;': '&' }[matches]
  })
}

export function parseUrl<T>(url: string) {
  const splitArr = url.split('?')
  if (splitArr.length != 2) {
    return null
  }
  return JSON.parse(JSON.stringify(parse(decodeHTML(splitArr[1])))) as unknown as T
}

export function validateParamKey(params: object, keys: string[]) {
  const paramKeys = Object.keys(params)
  return paramKeys.every(value => keys.includes(value))
}
