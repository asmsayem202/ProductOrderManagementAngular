import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnInit {
  order!: Order;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.getOrderDetails(+orderId);
    }
  }

  getOrderDetails(id: number): void {
    this.orderService.getOrder(id).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load order details.';
        this.isLoading = false;
      },
    });
  }
}
