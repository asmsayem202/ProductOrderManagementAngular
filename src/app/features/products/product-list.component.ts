import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  standalone: true,
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  errorMessage = '';
  showDeleteModal = false;
  selectedProduct: Product | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => (this.products = res),
      error: () => (this.errorMessage = 'Failed to load products'),
    });
  }

  createProduct() {
    this.router.navigate(['/products/create']);
  }

  editProduct(id?: number) {
    if (id) {
      this.router.navigate(['/products/edit', id]);
    }
  }

  viewProductDetails(id: number) {
    this.router.navigate(['/products/details', id]);
  }

  deleteProduct(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      this.selectedProduct = product;
      this.showDeleteModal = true;
    }
  }

  closeModal() {
    this.showDeleteModal = false;
    this.selectedProduct = null;
  }

  confirmDelete() {
    if (!this.selectedProduct || this.selectedProduct.id === undefined) return;

    this.productService.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        this.products = this.products.filter(
          (p) => p.id !== this.selectedProduct!.id
        );
        this.closeModal();
      },
      error: () => {
        this.errorMessage = 'Failed to delete product';
        this.closeModal();
      },
    });
  }
}
