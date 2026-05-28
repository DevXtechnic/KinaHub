import type { ProductType } from './products';
import { getCurrentLocale } from '../i18n/localeStore';

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
  delivery_method: string;
  delivery_fee: string;
  promo_code: string;
  discount_amount: string;
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
  const locale = getCurrentLocale();
  const labels: Record<string, Record<string, string>> = {
    en: {
      cod: 'COD',
      esewa: 'eSewa',
      khalti: 'Khalti',
      fonepay_qr: 'Fonepay QR',
      card: 'Card payments',
      ime_pay: 'IME Pay',
    },
    np: {
      cod: 'COD',
      esewa: 'eSewa',
      khalti: 'Khalti',
      fonepay_qr: 'Fonepay QR',
      card: 'कार्ड भुक्तानी',
      ime_pay: 'IME Pay',
    },
  };

  return labels[locale][method] || labels.en[method] || method;
}

export function deliveryLabel(method: string) {
  const locale = getCurrentLocale();
  const labels: Record<string, Record<string, string>> = {
    en: {
      standard: 'Standard delivery',
      overnight: 'Overnight delivery',
    },
    np: {
      standard: 'मानक डेलिभरी',
      overnight: 'अर्को दिन डेलिभरी',
    },
  };

  return labels[locale][method] || labels.en[method] || method;
}

export function orderStatusLabel(status: string) {
  const locale = getCurrentLocale();
  const labels: Record<string, Record<string, string>> = {
    en: {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
    np: {
      pending: 'पेन्डिङ',
      processing: 'प्रोसेस हुँदैछ',
      shipped: 'पठाइयो',
      delivered: 'डेलिभर भयो',
      cancelled: 'रद्द गरियो',
    },
  };

  return labels[locale][status] || labels.en[status] || status;
}
