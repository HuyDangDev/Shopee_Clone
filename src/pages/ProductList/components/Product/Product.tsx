import { Link } from 'react-router-dom';
import { ProductRating } from 'src/components';
import { PATH } from 'src/constants';
import { ProductType } from 'src/types';
import { formatCurrency, formatCurrencySocialStyle, generateNameId } from 'src/utils';

export interface Props {
  product: ProductType;
}

export const Product = ({ product }: Props) => {
  const { image, name, sold, price_before_discount, price, rating } = product;
  return (
    <Link to={`${PATH.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='overflow-hidden rounded-md bg-white shadow transition-transform duration-100 hover:translate-y-[-0.4rem]  hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img src={image} alt='' className='absolute top-0 left-0 h-full w-full bg-white object-cover' />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[2rem] text-sm line-clamp-2'>{name}</div>
          <div className='my-2 flex h-full w-full flex-col justify-start overflow-hidden text-red-600 '>
            <div className=' w-20 border border-red-600 px-1 text-ssm'>#Shopdacbiet</div>
            <div className='left-0 my-5 truncate'>
              <span className='text-md text-gray-500 line-through'>
                <span className='text-xs pt-20'>₫</span>
                {formatCurrency(price_before_discount)}
              </span>
              <span>
                <span className='text-xs'>₫</span>
                {formatCurrency(price)}
              </span>
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
  );
};
