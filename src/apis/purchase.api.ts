import { Purchase, PurchaseListStatus, SuccessResponseApi } from 'src/types';
import http from 'src/utils/http';

const URL = 'purchases';

export type ProductInfo = {
  product_id: string;
  buy_count: number;
};

export const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponseApi<Purchase>>(`${URL}/add-to-cart`, body);
  },
  getPurchases(params: { status: PurchaseListStatus | number }) {
    return http.get<SuccessResponseApi<Purchase[]>>(`${URL}`, {
      params
    });
  },
  buyProducts(body: ProductInfo[]) {
    return http.post<SuccessResponseApi<Purchase[]>>(`${URL}/buy-products`, body);
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponseApi<Purchase[]>>(`${URL}/update-purchase`, body);
  },
  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponseApi<{ deleted_count: number }>>(`${URL}`, { data: purchaseIds });
  }
};
