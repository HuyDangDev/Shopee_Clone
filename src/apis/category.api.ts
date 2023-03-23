import { Category, SuccessResponseApi } from 'src/types'
import http from 'src/utils/http'

const URL = '/categories'

export const categoryApi = {
  getCategories: () => http.get<SuccessResponseApi<Category[]>>(URL, {})
}
