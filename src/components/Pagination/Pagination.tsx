import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import { PATH } from 'src/constants'
import { QueryConfig } from 'src/pages'

interface PaginationProps {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2
export const Pagination = ({ queryConfig, pageSize }: PaginationProps) => {
  const currentPage = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='mx-2  rounded border bg-white py-2 px-3 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='mx-2  rounded border bg-white  py-2 px-3 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        }
        if (currentPage > RANGE * 2 + 1 && currentPage < pageSize - RANGE * 2) {
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          }
          if (pageNumber > currentPage + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        }

        if (currentPage >= pageSize - RANGE * 2 && pageNumber <= currentPage - RANGE && pageNumber > RANGE) {
          return renderDotBefore(index)
        }

        return (
          <Link
            to={{
              pathname: PATH.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('mx-2 cursor-pointer rounded border bg-white py-2 px-3 shadow-sm', {
              'border-cyan-500': pageNumber === currentPage,
              'border-transparent': pageNumber !== currentPage
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {currentPage === 1 ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 py-2 px-3 shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: PATH.home,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage - 1).toString()
            }).toString()
          }}
          className='mx-2 rounded border bg-white py-2 px-3 shadow-sm'
        >
          Prev
        </Link>
      )}

      {renderPagination()}
      {currentPage === pageSize ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 py-2 px-3 shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: PATH.home,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage + 1).toString()
            }).toString()
          }}
          className='mx-2 rounded border bg-white py-2 px-3 shadow-sm'
        >
          Next
        </Link>
      )}
    </div>
  )
}
