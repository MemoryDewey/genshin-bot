export const dictToArray = (dict: object): Array<any> =>
  Object.keys(dict).map(name => dict[name])

export * from './db'
export * from './logger'
