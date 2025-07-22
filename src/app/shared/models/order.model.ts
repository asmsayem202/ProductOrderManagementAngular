export interface CreateOrderItem {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface CreateOrder {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: CreateOrderItem[];
}

export interface OrderItem {
  id: number;
  productName: string;
  variantColor: string;
  variantSpecification: string;
  variantSize: 'Small' | 'Medium' | 'Large';
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  orderDate?: string;
  items: OrderItem[];
}

interface OrderDetailsDto {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  orderDate: string;
  items: {
    productName: string;
    variantColor: string;
    variantSpecification: string;
    variantSize: string;
    quantity: number;
  }[];
}
