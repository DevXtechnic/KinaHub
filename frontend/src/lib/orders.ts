import type { ProductType } from './products';

export interface OrderItemType {
  id: number;
  product: ProductType;
  quantity: number;
  price: string;
}

export interface PaymentType {
  id: number;
  method: string;
  status: string;
  amount: string;
}

export interface OrderType {
  id: number;
  customer_email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  total_price: string;
  shipping_address: string;
  customer_note: string;
  items: OrderItemType[];
  payment?: PaymentType;
  created_at: string;
  updated_at: string;
}

export const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export function paymentLabel(method: string) {
  const labels: Record<string, string> = {
    cod: 'COD',
    esewa: 'eSewa',
    khalti: 'Khalti',
    fonepay_qr: 'Fonepay QR',
    card: 'Card payments',
    ime_pay: 'IME Pay',
  };

  return labels[method] || method;
}
