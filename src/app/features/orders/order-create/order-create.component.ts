import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Product, Variant } from '../../../shared/models/product.model';
import { ProductService } from '../../../shared/services/product.service';
import { OrderService } from '../../../shared/services/order.service';
import { CommonModule } from '@angular/common';
import { Toast } from '../../../core/utils/toast';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './order-create.component.html',
})
export class OrderCreateComponent implements OnInit {
  step = 1;

  allProducts: Product[] = [];
  selectedProducts: Product[] = [];

  productVariants: { [productId: number]: Variant[] } = {};
  variantSelectionForm!: FormGroup;

  customerForm!: FormGroup;

  totalQuantity = 0;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();

    // Step 2: Variants + Quantity
    this.variantSelectionForm = this.fb.group({
      items: this.fb.array([]), // dynamic
    });

    // Subscribe to changes to recalculate total quantity live
    this.variantSelectionForm.valueChanges.subscribe(() => {
      this.updateTotalQuantity();
    });

    // Step 3: Customer Info
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerAddress: ['', Validators.required],
    });
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.productVariants = {};
        for (const product of products) {
          if (product.id != null) {
            this.productVariants[product.id] = product.variants;
          }
        }
      },
      error: () => (this.errorMessage = 'Failed to load products'),
    });
  }

  get itemsControls(): AbstractControl[] {
    return (this.variantSelectionForm.get('items') as FormArray).controls;
  }

  updateTotalQuantity(): void {
    const items = this.variantSelectionForm.get('items') as FormArray;
    this.totalQuantity = items.controls.reduce(
      (sum, itemGroup: AbstractControl) => {
        const qty = itemGroup.get('quantity')?.value;
        return sum + (parseInt(qty, 10) || 0);
      },
      0
    );
  }

  isVariantSelectionValid(): boolean {
    return this.itemsControls.every((item) => !!item.get('variantId')?.value);
  }

  goToNextStep(): void {
    if (this.step === 1) {
      if (this.selectedProducts.length === 0) return;

      const itemsFormArray = this.variantSelectionForm.get(
        'items'
      ) as FormArray;
      itemsFormArray.clear();

      this.selectedProducts.forEach((product) => {
        this.productService.getProduct(product.id!).subscribe({
          next: (productData) => {
            this.productVariants[product.id!] = productData.variants;

            itemsFormArray.push(
              this.fb.group({
                productId: [product.id],
                variantId: [null, Validators.required],
                quantity: [1, [Validators.required, Validators.min(1)]],
              })
            );
          },
          error: () => (this.errorMessage = 'Failed to load variants'),
        });
      });
    }

    if (this.step === 2) {
      this.calculateTotalQuantity();
    }

    this.step++;
  }

  goToPreviousStep(): void {
    this.step--;
  }

  onProductToggle(product: Product): void {
    const exists = this.selectedProducts.find((p) => p.id === product.id);
    if (exists) {
      this.selectedProducts = this.selectedProducts.filter(
        (p) => p.id !== product.id
      );
    } else {
      this.selectedProducts.push(product);
    }
  }

  calculateTotalQuantity(): void {
    const items = this.variantSelectionForm.value.items;
    this.totalQuantity = items.reduce(
      (sum: number, item: any) => sum + Number(item.quantity),
      0
    );
  }

  submitOrder(): void {
    if (this.variantSelectionForm.invalid || this.customerForm.invalid) return;

    const orderPayload = {
      ...this.customerForm.value,
      items: this.variantSelectionForm.value.items,
    };

    this.isSubmitting = true;
    this.orderService.createOrder(orderPayload).subscribe({
      next: () => {
        this.isSubmitting = false;
        Toast.fire({
          icon: 'success',
          title: 'Order create successful',
        });
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.isSubmitting = false;
        Toast.fire({
          icon: 'error',
          title: 'Order create failed',
          text: err?.error?.message || 'Failed to create order',
        });
      },
    });
  }
}
