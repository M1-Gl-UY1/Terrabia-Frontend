// Types pour le paiement
export type PaymentMethod = 'orange' | 'momo' | 'card';

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  icon: any; // Pour les images require()
  description?: string;
}

export interface PaymentState {
  selectedMethod: PaymentMethod | null;
  isProcessing: boolean;
  error: string | null;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  deliveryMode: 'domicile' | 'relais';
  vendor: Vendor;
  status: OrderStatus;
  createdAt: Date;
  paymentMethod?: PaymentMethod;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
  unit: string;
}

export interface DeliveryAddress {
  name: string;
  location: string;
  phone: string;
}

export interface Vendor {
  id: string;
  name: string;
  rating?: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';