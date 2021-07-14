import { connectDb, loadModules } from 'framework/bootstrap'
import { mirai } from 'framework'
import * as Module from 'src/modules'
import { dictToArray, logger } from 'framework/utils'

async function app() {
  try {
    await connectDb()
    await loadModules(dictToArray(Module))
    mirai.listen()
  } catch (e) {
    console.log(e)
    logger.error(e.toString())
  }
}
;(async () => {
  await app()
})()
