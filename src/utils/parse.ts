import qs from 'querystring'

export function parseUrl<T>(url: string) {
  const splitArr = url.split('?')
  if (splitArr.length != 2) {
    return null
  }
  return JSON.parse(JSON.stringify(qs.parse(splitArr[1]))) as unknown as T
}

export function validateParamKey(params: object, keys: string[]) {
  const paramKeys = Object.keys(params)
  return paramKeys.every(value => keys.includes(value))
}
