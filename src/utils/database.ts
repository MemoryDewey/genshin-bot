import { Injectable } from 'framework/decorators'
import { Low, JSONFile } from 'lowdb'
import { join } from 'path'

@Injectable()
export class Database<T> {
  private db: Low<T[]>

  constructor(dbName = 'db') {
    const adapter = new JSONFile<T[]>(join(__dirname, `./src/database/${dbName}.json`))
    this.db = new Low<T[]>(adapter)
  }

  public findBy(key: keyof T, value: any) {
    return this.db.data.find(value1 => value1[key] == value)
  }

  public insert(value: T) {
    this.db.data.push(value)
  }
}
