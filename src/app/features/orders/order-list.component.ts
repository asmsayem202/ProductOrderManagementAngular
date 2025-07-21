import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { Order } from '../../shared/models/order.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  errorMessage = '';
  showDeleteModal = false;
  selectedOrder: Order | null = null;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (res) => (this.orders = res),
      error: () => (this.errorMessage = 'Failed to load orders'),
    });
  }

  createOrder() {
    this.router.navigate(['/orders/create']);
  }

  editOrder(id?: number) {
    if (id) {
      this.router.navigate(['/orders/edit', id]);
    }
  }

  viewOrderDetails(id: number) {
    this.router.navigate(['/orders/details', id]);
  }

  deleteOrder(id: number) {
    const order = this.orders.find((o) => o.id === id);
    if (order) {
      this.selectedOrder = order;
      this.showDeleteModal = true;
    }
  }

  closeModal() {
    this.showDeleteModal = false;
    this.selectedOrder = null;
  }

  confirmDeleteOrder() {
    if (!this.selectedOrder || this.selectedOrder.id === undefined) return;

    this.orderService.deleteOrder(this.selectedOrder.id).subscribe({
      next: () => {
        this.orders = this.orders.filter(
          (o) => o.id !== this.selectedOrder!.id
        );
        this.closeModal();
      },
      error: () => {
        this.errorMessage = 'Failed to delete order';
        this.closeModal();
      },
    });
  }
}
