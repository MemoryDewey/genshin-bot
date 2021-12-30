import { OneBot } from '../framework/bot'

const app = new OneBot({ host: '1.14.246.248', port: 6700 })

app.start()
app.onGroupMessage(bot => {
  console.log(bot.text)
  console.log(bot.imageUrls)
  return { qq: 12345 }
})
