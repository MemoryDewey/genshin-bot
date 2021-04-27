import { loadModules } from 'framework/bootstrap'
import { mirai } from 'framework'

async function app() {
  //await loadModules()
  mirai.listen()
}
app()
