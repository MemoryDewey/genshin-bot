import axios, { AxiosInstance } from 'axios'
import { Injectable } from 'framework/decorators'

@Injectable()
export class Http {
  private instance: AxiosInstance
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
      },
    })
  }

  public get<T>(url: string, params: object) {
    return this.instance.get<T>(url, { params })
  }

  public post<T>(url: string, data: object) {
    return this.instance.post<T>(url, data)
  }
}
