// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      // },
      // {
      //   path: 'products',
      //   loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
      // },
      // {
      //   path: 'orders',
      //   loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
      // }
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
