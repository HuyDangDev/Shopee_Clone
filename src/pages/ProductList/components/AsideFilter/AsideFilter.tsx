import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { omit } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { Button } from 'src/components'
import { InputNumber } from 'src/components/InputNumber'
import { PATH } from 'src/constants'
import { Category, NoUndefinedField } from 'src/types'
import { Schema, schema } from 'src/utils'
import { QueryConfig } from '../../ProductList'
import { RatingStar } from '../RatingStar'

interface AsideFilterProps {
  categories: Category[]
  queryConfig: QueryConfig
}

type FormDataAside = NoUndefinedField<Pick<Schema, 'price_min' | 'price_max'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

export const AsideFilter = ({ categories, queryConfig }: AsideFilterProps) => {
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormDataAside>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },

    resolver: yupResolver(priceSchema),
    shouldFocusError: true
  })

  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: PATH.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    reset()
    navigate({
      pathname: PATH.home,
      search: createSearchParams(omit(queryConfig, ['category', 'price_max', 'price_min', 'rating_filter'])).toString()
    })
  }

  return (
    <div className='py-4'>
      <Link
        to={PATH.home}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id
          return (
            <li className='py-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: PATH.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2 ', { 'font-semibold text-orange': isActive })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute top-1 h-2 w-2 fill-orange '>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                <span className='ml-2'>{categoryItem.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={PATH.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='₫ TỪ'
                    classNameError='hidden'
                    {...field}
                  />
                )
              }}
            />
            <div className='mx-2 mt-2 shrink-0 text-center'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    placeholder='₫ ĐẾN'
                    {...field}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 min-h-[1rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
            Áp dụng
          </Button>
        </form>
      </div>

      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-sm'>Đánh giá</div>
      <div className='my-3'>
        <RatingStar queryConfig={queryConfig} />
        <div className='my-4 h-[1px] bg-gray-300' />
        <Button
          onClick={() => handleRemoveAll()}
          className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'
        >
          Xóa tất cả
        </Button>
      </div>
    </div>
  )
}
