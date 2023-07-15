import { ProductList, ProductListConfig, ProductType, SuccessResponseApi } from 'src/types'
import http from 'src/utils/http'

const URL = '/products'

export const productApi = {
  getProducts: async (params: ProductListConfig) => await http.get<SuccessResponseApi<ProductList>>(URL, { params }),
  getProductDetail: async (id: string) => await http.get<SuccessResponseApi<ProductType>>(`${URL}/${id}`)
}
