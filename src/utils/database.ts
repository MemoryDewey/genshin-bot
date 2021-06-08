import { Injectable } from 'framework/decorators'
import low, { LowdbAsync } from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync'

@Injectable()
export class Database {
  private db: LowdbAsync<any>

  constructor(dbName = 'db') {
    const adapter = new FileAsync(`./src/database/${dbName}.json`)
    low(adapter).then(db => {
      this.db = db
    })
  }

  public get(key: string) {
    return this.db.get(key)
  }

  public set(key: string, value: object) {
    this.db.set(key, value).write()
  }
}
