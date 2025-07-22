import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Product,
  Variant,
  ProductType,
  Size,
} from '../../../shared/models/product.model';
import { Toast } from '../../../core/utils/toast';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './product-edit.component.html',
})
export class ProductEditComponent implements OnInit {
  productId!: number;
  productTypes: ProductType[] = ['Mug', 'Jug', 'Cup', 'Plate', 'Bottle'];
  sizes: Size[] = ['Small', 'Medium', 'Large'];

  productForm = this.fb.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    type: ['', Validators.required],
    variants: this.fb.array([]),
  });

  get variants() {
    return this.productForm.get('variants') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct(this.productId);
  }

  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          brand: product.brand,
          type: product.type,
        });

        // clear existing variants
        while (this.variants.length) {
          this.variants.removeAt(0);
        }

        product.variants.forEach((v) => {
          this.variants.push(
            this.fb.group({
              color: [v.color, Validators.required],
              specification: [v.specification, Validators.required],
              size: [v.size, Validators.required],
            })
          );
        });
      },
      error: () => alert('Failed to load product'),
    });
  }

  addVariant() {
    this.variants.push(
      this.fb.group({
        color: ['', Validators.required],
        specification: ['', Validators.required],
        size: ['', Validators.required],
      })
    );
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  onUpdate() {
    if (this.productForm.invalid) return;

    const formValue = this.productForm.value;

    const variants: Variant[] = (formValue.variants || []).map((v: any) => ({
      id: v.id,
      color: v.color,
      specification: v.specification,
      size: v.size,
    }));

    const product: Product = {
      name: formValue.name!,
      brand: formValue.brand!,
      type: formValue.type as ProductType,
      variants: variants,
    };

    this.productService.updateProduct(this.productId, product).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: 'Product update successful',
        });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        Toast.fire({
          icon: 'error',
          title: 'Product update failed',
          text: err?.error?.message || 'Failed to update product',
        });
      },
    });
  }
}
