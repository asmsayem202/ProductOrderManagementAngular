# 🛒 Product & Order Management System

A full-stack web application to manage products and customer orders, featuring a modern responsive UI with Angular 17 and a secure backend API built using ASP.NET Core (.NET 8). Includes a dynamic dashboard with metrics and recent order tracking.

---

## 📸 Features

### ✅ Frontend (Angular 17 + Tailwind CSS)
- 🚀 Standalone Angular components with modern architecture
- 📊 Dashboard with live statistics:
  - Total products
  - Total orders
  - Total order items
  - Recent orders (with customer info and created date)
- 📦 Product management (Create, Read, Update, Delete)
- 🧾 Order management with multi-step creation/editing
- 🔐 JWT-based authentication
- 🎨 Tailwind CSS for styling + Font Awesome icons
- 📱 Responsive sidebar layout and user menu

### ✅ Backend (.NET 8 Web API)
- CRUD APIs for `Products`, `Orders`, and `Users`
- Role-based authorization with seeded default user
- JWT token generation and validation
- EF Core with SQL Server database

---

## 🏗️ Technologies

| Tech             | Description                  |
|------------------|------------------------------|
| Angular 17       | Frontend Framework            |
| ASP.NET Core 8   | Backend Web API               |
| EF Core          | ORM for SQL Server            |
| Tailwind CSS     | Utility-first CSS framework   |
| Font Awesome     | Icon Library                  |
| JWT              | Authentication mechanism      |

---

## 🚀 Getting Started

### 📦 Backend Setup

1. Clone the repository
2. Navigate to the backend project folder
3. Update `appsettings.json` with your SQL Server connection string
4. Run migrations and start the API

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
