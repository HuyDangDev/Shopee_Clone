import { useQuery } from '@tanstack/react-query'
import { productApi } from 'src/apis'
import { categoryApi } from 'src/apis/category.api'
import { Pagination } from 'src/components'
import { useQueryConfig, useQueryParams } from 'src/hooks'
import { ProductListConfig } from 'src/types'
import { AsideFilter } from './components/AsideFilter'
import { Product } from './components/Product'
import { SortProductList } from './components/SortProductList'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export const ProductList = () => {
  const queryConfig = useQueryConfig()
  const queryParams = useQueryParams()

  const { data: ProductData } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: CategoryData } = useQuery({
    queryKey: ['categories', queryParams],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {CategoryData && ProductData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={CategoryData?.data?.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={ProductData?.data?.data?.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {ProductData?.data?.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={ProductData?.data?.data?.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
