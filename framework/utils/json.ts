export function JsonString2Object<T extends object>(data: string) {
  return JSON.parse(data) as T
}
