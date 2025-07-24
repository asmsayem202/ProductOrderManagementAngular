// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product.service';
import { OrderService } from '../../shared/services/order.service';
import { RouterModule } from '@angular/router';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  totalProducts: number = 0;
  totalOrders: number = 0;
  totalOrderItems: number = 0;
  recentOrders: Order[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.productService.getProducts().subscribe((products) => {
      this.totalProducts = products.length;
    });

    this.orderService.getOrders().subscribe((orders) => {
      this.totalOrders = orders.length;
      this.totalOrderItems = orders.reduce((acc: number, order: any) => {
        return (
          acc +
          order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
        );
      }, 0);

      this.recentOrders = orders;
    });
  }
}
