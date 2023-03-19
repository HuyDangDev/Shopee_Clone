import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { PATH } from 'src/constants'
import { AuthResponse } from 'src/types'

import {
  clearAccountInfoFromLS,
  getAccessTokenFromLS,
  saveAccessTokenToLS as setAccessTokenToLS,
  setProfile as setProfileToLS
} from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = getAccessTokenFromLS() ?? ''
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error: AxiosError) => {
        Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === PATH.login || url === PATH.register) {
          const responseData: AuthResponse = response.data
          this.accessToken = responseData.data.access_token
          setAccessTokenToLS(this.accessToken)
          setProfileToLS(responseData.data.user)
        }
        if (url === PATH.logout) {
          this.accessToken = ''
          clearAccountInfoFromLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
