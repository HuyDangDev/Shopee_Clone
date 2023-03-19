import { Link } from 'react-router-dom'
import { ProductRating } from 'src/components'
import { ProductType } from 'src/types'
import { formatCurrency, formatCurrencySocialStyle } from 'src/utils'

export interface Props {
  product: ProductType
}

export const Product = ({ product }: Props) => {
  const { image, name, sold, price_before_discount, price, rating } = product
  return (
    <Link to='/'>
      <div className='bg-white shadow rounded-md hover:translate-y-[-0.4rem] hover:shadow-md duration-100 transition-transform  overflow-hidden'>
        <div className='w-full pt-[100%] relative'>
          <img src={image} alt='' className='absolute top-0 left-0 bg-white w-full h-full object-cover' />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem] line-clamp-2 text-sm'>{name}</div>
          <div className='flex flex-col justify-start my-2 overflow-hidden text-red-600 h-full w-full '>
            <div className=' w-20 px-1 border border-red-600 text-ssm'>#Shopdacbiet</div>
            <div className='text-md my-5 truncate left-0'>
              <span className='line-through text-gray-700'>₫{formatCurrency(price_before_discount)}</span>
              <span>₫{formatCurrency(price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <ProductRating rating={rating} />
            <div className='ml-2 text-ssm'>
              <span className='mr-1'>{formatCurrencySocialStyle(sold)}</span>
              <span>Đã bán </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
