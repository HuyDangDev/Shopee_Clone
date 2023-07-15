import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { productApi } from 'src/apis'
import { categoryApi } from 'src/apis/category.api'
import { Pagination } from 'src/components'
import { useQueryParams } from 'src/hooks/useQueryParams'
import { ProductListConfig } from 'src/types'
import { AsideFilter } from './components/AsideFilter'
import { Product } from './components/Product'
import { SortProductList } from './components/SortProductList'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export const ProductList = () => {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page ?? '1',
      limit: queryParams.limit ?? 15,
      order: queryParams.order,
      sort_by: queryParams.sort_by,
      category: queryParams.category,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      name: queryParams.name
    },
    isUndefined
  )

  const { data: ProductData } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    keepPreviousData: true
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
              <AsideFilter queryConfig={queryConfig} categories={CategoryData.data?.data || []} />
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
