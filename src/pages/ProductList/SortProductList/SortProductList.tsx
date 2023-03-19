import classNames from 'classnames'
import { omit } from 'lodash'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Button } from 'src/components'
import { PATH, sortBy, order as orderConstant } from 'src/constants'
import { ProductListConfig } from 'src/types'
import { QueryConfig } from '../ProductList'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export const SortProductList = ({ queryConfig, pageSize }: Props) => {
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const navigate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSortByValue = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return navigate({
      pathname: PATH.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    return navigate({
      pathname: PATH.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <span>Sắp xếp theo</span>
          <Button
            className={classNames('h-10 rounded-sm  px-4 text-center text-sm capitalize  ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSortByValue(sortBy.view)}
          >
            Phổ biến
          </Button>
          <Button
            className={classNames('h-10 rounded-sm  px-4 text-center text-sm capitalize  ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSortByValue(sortBy.createdAt)}
          >
            Mới nhất
          </Button>
          <Button
            className={classNames('h-10 rounded-sm  px-4 text-center text-sm capitalize  ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSortByValue(sortBy.sold)}
          >
            Bán chạy
          </Button>
          <select
            name=''
            id=''
            className={classNames('h-10 rounded-sm  px-4 text-center text-sm capitalize outline-none', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(event) => handlePriceOrder(event.target.value)}
          >
            <option disabled className='bg-white text-black'>
              Giá
            </option>
            <option value={orderConstant.asc} className='bg-white text-black'>
              Giá: Thấp đến cao
            </option>
            <option value={orderConstant.desc} className='bg-white text-black'>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>1</span>
            <span>/2</span>
          </div>
          <div className='ml-3'>
            <Button className='h-8 cursor-not-allowed rounded-l-sm bg-white/60 px-2 hover:bg-slate-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-5 w-5 text-slate-400'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </Button>
            <Button className='h-8 rounded-r-sm bg-white/60 px-2 hover:bg-slate-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
