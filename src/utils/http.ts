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

  public get<T>(url: string, params: object) {
    return this.instance.get<T>(url, { params })
  }

  public post<T>(url: string, data: object) {
    return this.instance.post<T>(url, data)
  }
}
