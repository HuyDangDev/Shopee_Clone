import { isUndefined, omitBy } from 'lodash'
import { ProductListConfig } from 'src/types'
import { useQueryParams } from './useQueryParams'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export const useQueryConfig = () => {
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

  return queryConfig
}
