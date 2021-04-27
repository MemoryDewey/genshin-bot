import { loadModules } from 'framework/bootstrap'
import { mirai } from 'framework'
import * as Module from 'src/modules'
import { dictToArray } from 'framework/utils'

async function app() {
  await loadModules(dictToArray(Module))
  mirai.listen()
}
app()
