export const wishParamKey = [
  'authkey_ver',
  'sign_type',
  'auth_appid',
  'init_type',
  'gacha_id',
  'timestamp',
  'lang',
  'device_type',
  'ext',
  'game_version',
  'plat_type',
  'region',
  'authkey',
  'game_biz',
]

// 100 新手
// 200 常驻
// 301 角色up
// 302 武器up
export const gachaTypes = [100, 200, 301, 302]
export const gachaNames = ['新手', '常驻', '角色', '武器']
export enum GachaInfo {
  '新手' = 100,
  '常驻' = 200,
  '角色' = 301,
  '武器',
}
