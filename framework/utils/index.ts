export const dictToArray = (dict: object): Array<any> =>
  Object.keys(dict).map(name => dict[name])
