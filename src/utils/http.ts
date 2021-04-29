import axios, { AxiosInstance } from 'axios'
import { Injectable } from 'framework/decorators'

@Injectable()
export class Http {
  private instance: AxiosInstance
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    })
  }
}
