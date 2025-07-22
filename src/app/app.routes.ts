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
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard', // ⬅️ default redirect to dashboard
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import(
            './features/products/product-list/product-list.component'
          ).then((m) => m.ProductListComponent),
      },
      {
        path: 'products/create',
        loadComponent: () =>
          import(
            './features/products/product-create/product-create.component'
          ).then((m) => m.ProductCreateComponent),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import(
            './features/products/product-edit/product-edit.component'
          ).then((m) => m.ProductEditComponent),
      },
      {
        path: 'products/details/:id',
        loadComponent: () =>
          import(
            './features/products/product-details/product-details.component'
          ).then((m) => m.ProductDetailsComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/order-list/order-list.component').then(
            (m) => m.OrderListComponent
          ),
      },
      {
        path: 'orders/create',
        loadComponent: () =>
          import('./features/orders/order-create/order-create.component').then(
            (m) => m.OrderCreateComponent
          ),
      },
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
    redirectTo: '', // fallback to the layout (which will redirect to dashboard)
  },
];
