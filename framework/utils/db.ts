import { createConnection } from 'typeorm'

const connection = createConnection({
  type: 'sqlite',
  database: './src/database/genshin-bot.sqlite',
  entities: ['src/entities/*.entity.ts'],
  synchronize: true,
})

export { connection }
