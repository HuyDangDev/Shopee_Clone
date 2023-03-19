/* eslint-disable import/no-named-as-default-member */
import axios, { AxiosError, HttpStatusCode } from 'axios'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return axios.isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrency(money: number) {
  return new Intl.NumberFormat('de-DE').format(money)
}

export function formatCurrencySocialStyle(money: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 })
    .format(money)
    .replace('.', ',')
    .toLowerCase()
}
