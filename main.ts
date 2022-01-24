import { connectDb, loadModules } from 'framework/bootstrap'
import { app } from 'framework'
import * as Module from 'src/modules'
import { dictToArray, logger } from 'framework/utils'

async function start() {
  try {
    await connectDb()
    app.start()
    await loadModules(dictToArray(Module))
    app.setGroupWhiteList(1028290476, /食物|食品|应急|吃|伙伴|工具|杯子/g)
  } catch (e) {
    logger.error(e)
    setInterval(async () => {
      await start()
    }, 3000)
  }
}
;(async () => {
  await start()
})()
