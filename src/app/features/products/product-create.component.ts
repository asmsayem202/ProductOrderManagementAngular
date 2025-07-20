import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Product,
  ProductType,
  Variant,
} from '../../shared/models/product.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './product-create.component.html',
})
export class ProductCreateComponent implements OnInit {
  productTypes = ['Mug', 'Jug', 'Cup', 'Plate', 'Bottle'];
  sizes = ['Small', 'Medium', 'Large'];

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addVariant(); // start with 1 variant
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

  onSubmit() {
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

    this.productService.createProduct(product).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => alert('Failed to create product'),
    });
  }
}
