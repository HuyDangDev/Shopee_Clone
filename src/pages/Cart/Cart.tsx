import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import { keyBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { purchaseApi } from 'src/apis';
import { Button, QuantityController } from 'src/components';
import { PATH, purchasesStatus } from 'src/constants';
import { Purchase } from 'src/types';
import { formatCurrency, generateNameId } from 'src/utils';

interface ExtendedPurchase extends Purchase {
  disabled: boolean;
  checked: boolean;
}
export const Cart = () => {
  const [extendedPurchase, setExtendedPurchase] = useState<ExtendedPurchase[]>([]);
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  });

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch();
    }
  });

  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch();
    }
  });

  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch();
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      });
    }
  });
  const purchasesInCart = purchasesInCartData?.data?.data;
  const checkedPurchases = extendedPurchase.filter((purchase) => purchase.checked);
  const checkedPurchasesCount = checkedPurchases.length;
  const totalCheckedPurchasesPrice = checkedPurchases.reduce(
    (result, current) => result + current.product.price * current.buy_count,
    0
  );

  const totalCheckedPurchasesPriceSaving = checkedPurchases.reduce(
    (result, current) => result + (current.product.price_before_discount - current.product.price) * current.buy_count,
    0
  );

  useEffect(() => {
    setExtendedPurchase((prev) => {
      const extendedPurchaseGroupById = keyBy(prev, '_id');
      return (
        (purchasesInCart &&
          purchasesInCart.map((purchase) => ({
            ...purchase,
            disabled: false,
            checked: Boolean(extendedPurchaseGroupById[purchase._id]?.checked)
          }))) ||
        []
      );
    });
  }, [purchasesInCart]);
  const isAllChecked = extendedPurchase.every((purchase) => purchase.checked);

  const handleChecked = (producIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchase(
      produce((draft) => {
        draft[producIndex].checked = event.target.checked;
      })
    );
  };

  const handleCheckAll = () => {
    setExtendedPurchase(
      (prev) =>
        prev &&
        prev.map((purchase) => ({
          ...purchase,
          checked: !isAllChecked
        }))
    );
  };

  const handleQuantity = (purchaseIndex: number, value: number): void => {
    const purchase = extendedPurchase[purchaseIndex];
    if (value === purchasesInCart?.[purchaseIndex].buy_count) {
      return;
    }
    setExtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].disabled = true;
      })
    );
    updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value });
  };

  const handleTypeQuantity =
    (purchaseIndex: number) =>
    (value: number): void => {
      setExtendedPurchase(
        produce((draft) => {
          draft[purchaseIndex].buy_count = value;
        })
      );
    };

  const handleDeletePurchase = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchase[purchaseIndex]._id;
    deletePurchaseMutation.mutate([purchaseId]);
  };

  const handleDeletePurchases = () => () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id);
    deletePurchaseMutation.mutate(purchaseIds);
  };

  const handleBuyPurchases = () => {
    if (checkedPurchases.length === 0) {
      return;
    }
    const body = checkedPurchases.map((purchase) => ({
      product_id: purchase.product._id,
      buy_count: purchase.buy_count
    }));
    console.log(body);
    buyProductsMutation.mutate(body);
  };

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container max-w-[1200px]'>
        <div className='overflow-auto'>
          <div className='min-w-[800px]'>
            <div className='rounded-s grid grid-cols-12 bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='h-5 w-5 accent-orange'
                      checked={isAllChecked}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            {extendedPurchase.length > 0 && (
              <div className='my-3 rounded-sm bg-white p-5 shadow'>
                {extendedPurchase.map((purchase, index) => (
                  <div
                    key={purchase._id}
                    className='mb:0 grid grid-cols-12 rounded-sm border border-gray-200 px-4  py-4 text-center text-sm text-gray-500 first:mt-0'
                  >
                    <div className='col-span-6 '>
                      <div className='flex'>
                        <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                          <input
                            type='checkbox'
                            className='h-5 w-5 accent-orange'
                            checked={purchase.checked}
                            onChange={handleChecked(index)}
                          />
                        </div>
                        <div className='flex-grow'>
                          <div className='flex'>
                            <Link
                              className='h-20 w-20 flex-shrink-0'
                              to={`${PATH.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id
                              })}`}
                            >
                              <img src={purchase.product.image} alt={purchase.product.name} />
                            </Link>
                            <div className='flex flex-grow items-center px-2 pt-1 pb-2'>
                              <Link
                                to={`${PATH.home}${generateNameId({
                                  name: purchase.product.name,
                                  id: purchase.product._id
                                })}`}
                                className='line-clamp-2'
                              >
                                {purchase.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-6 flex items-center'>
                      <div className='grid grid-cols-5 items-center'>
                        <div className='col-span-2'>
                          <div className='flex items-center justify-center'>
                            <span className='text-gray-300 line-through'>
                              ₫{formatCurrency(purchase.product.price_before_discount)}
                            </span>
                            <span className='ml-3 '>₫{formatCurrency(purchase.product.price)}</span>
                          </div>
                        </div>
                        <div className='col-span-1'>
                          <QuantityController
                            onIncrease={(value) => handleQuantity(index, value)}
                            onDecrease={(value) => handleQuantity(index, value)}
                            max={purchase.product.quantity}
                            value={purchase.buy_count}
                            className='just-center flex'
                            disabled={purchase.disabled}
                            onFocusOut={(value) => handleQuantity(index, value)}
                            onType={handleTypeQuantity(index)}
                          ></QuantityController>
                        </div>
                        <div className='col-span-1'>
                          <span className='text-orange'>
                            ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                          </span>
                        </div>
                        <div className='col-span-1'>
                          <button
                            className='bg-none text-black transition-colors hover:text-orange'
                            onClick={handleDeletePurchase(index)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='sticky bottom-0 z-10 flex flex-col items-center rounded-sm bg-white p-5 sm:flex-row sm:items-center'>
          <div className='pr-3'>
            <input type='checkbox' className='h-5 w-5 accent-orange' checked={isAllChecked} onChange={handleCheckAll} />
          </div>
          <button className='cursor-default border-none bg-none px-3' onClick={handleCheckAll}>
            Chọn tất cả ({extendedPurchase.length})
          </button>
          <button className='border-none bg-none px-3' onClick={handleDeletePurchases}>
            Xóa
          </button>

          <button className='overflow-hidden text-ellipsis border-none bg-none px-3 text-orange'>
            Lưu vào mục đã thanh toán
          </button>

          <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
            <div>
              <div className='flex items-center sm:justify-end'>
                <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm): </div>
                <div className='ml-2 text-2xl text-orange'>{formatCurrency(totalCheckedPurchasesPrice)}</div>
              </div>
              <div className='flex items-center text-sm sm:justify-end'>
                <div className='text-gray-500'>Tiet Kiem</div>
                <div className='ml-6 text-orange'>{formatCurrency(totalCheckedPurchasesPriceSaving)}</div>
              </div>
            </div>
            <Button
              className='ml-5 h-10 w-52 bg-red-500  px-2 text-center text-sm  text-white hover:bg-red-600'
              onClick={handleBuyPurchases}
              disabled={buyProductsMutation.isLoading}
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
