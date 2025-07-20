// src/app/shared/models/product.model.ts

export type ProductType = 'Mug' | 'Jug' | 'Cup' | 'Plate' | 'Bottle';
export type Size = 'Small' | 'Medium' | 'Large';

export interface Variant {
  id?: number;
  color: string;
  specification: string;
  size: Size;
}

export interface Product {
  id?: number;
  name: string;
  brand: string;
  type: ProductType;
  variants: Variant[];
}
