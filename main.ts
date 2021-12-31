import { connectDb, loadModules } from 'framework/bootstrap'
import { app } from 'framework'
import * as Module from 'src/modules'
import { dictToArray, logger } from 'framework/utils'

async function start() {
  try {
    await connectDb()
    app.start()
    await loadModules(dictToArray(Module))
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
