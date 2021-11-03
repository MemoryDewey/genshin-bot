import { parseUrl, validateParamKey } from '../src/utils/parse'
import { WishParam } from '../src/types/wish.type'
import { wishParamKey } from '../src/modules/wish-export/constant'

const url = ''
const params = parseUrl<WishParam | null>(url)
console.log(validateParamKey(params, wishParamKey))
