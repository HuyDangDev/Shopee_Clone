import { SuccessResponseApi, ProductList, ProductListConfig, ProductType } from 'src/types'
import http from 'src/utils/http'

const URL = '/products'

export const productApi = {
  getProducts: (params: ProductListConfig) => http.get<SuccessResponseApi<ProductList>>(URL, { params }),
  getProductDetail: (id: string) => http.get<SuccessResponseApi<ProductType>>(`${URL}/${id}`)
}
