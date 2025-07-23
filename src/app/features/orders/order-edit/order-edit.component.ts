import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { Product, Variant } from '../../../shared/models/product.model';
import { Toast } from '../../../core/utils/toast';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class OrderEditComponent implements OnInit {
  orderForm!: FormGroup;
  orderId!: number;
  products: Product[] = [];
  variantMap: { [productId: number]: Variant[] } = {};
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadData();
  }

  initializeForm(): void {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerAddress: ['', Validators.required],
      items: this.fb.array([]),
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  loadData(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      products.forEach((p) => {
        if (p.id !== undefined) {
          this.variantMap[p.id] = p.variants;
        }
      });

      this.orderService.getOrder(this.orderId).subscribe((order) => {
        this.orderForm.patchValue({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerAddress: order.customerAddress,
        });

        const itemsForm = this.items;
        itemsForm.clear();

        order.items.forEach((item: any, i: number) => {
          const group = this.fb.group({
            productId: [item.productId, Validators.required],
            variantId: [null, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          });

          itemsForm.push(group);

          // Wait a tick to ensure form value is set, then load variants
          setTimeout(() => {
            this.onProductChange(i); // this sets variantMap[productId]
            group.get('variantId')?.setValue(item.variantId);
          });
        });
      });
    });
  }

  onProductChange(index: number): void {
    const itemGroup = this.items.at(index) as FormGroup;
    itemGroup.get('variantId')?.reset();
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        productId: [null, Validators.required],
        variantId: [null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  updateOrder(): void {
    if (this.orderForm.invalid) return;

    this.isSubmitting = true;
    this.orderService
      .updateOrder(this.orderId, this.orderForm.value)
      .subscribe({
        next: () => {
          Toast.fire({ icon: 'success', title: 'Order updated successfully' });
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          this.isSubmitting = false;
          Toast.fire({
            icon: 'error',
            title: 'Failed to update order',
            text: err?.error?.message || 'Something went wrong',
          });
        },
      });
  }
}
