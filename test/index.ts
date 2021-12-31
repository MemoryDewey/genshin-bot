import { OneBot } from 'framework/bot'

const app = new OneBot({ host: '1.14.246.248', port: 6700 })

app.start()
app.onGroupMessage(bot => {
  if (bot.isAt) {
    return [{ type: 'text', data: { text: 'TextMsg' } }]
  }
})
