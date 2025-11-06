# NeoStore – AI-Powered E-Commerce Backend

A fully modular, scalable, and production-ready **E-Commerce Backend** built using **NestJS**, **TypeScript**, **MongoDB**, and **Stripe**, enhanced with an **AI-powered product recommendation engine**.

---

## 🚀 Features

### ✅ **Architecture & Structure**

* Clean **modular architecture** using NestJS (Controllers, Services, Repositories).
* Separation of concerns for maximum scalability and maintainability.
* Centralized global modules, pipes, interceptors, and exception filters.

### ✅ **Authentication & Authorization**

* Secure authentication using **JWT**.
* **OTP verification** for account validation.
* **Role-based access control (RBAC)**: Admin, User, etc.

### ✅ **AI Product Recommendation Engine**

* Integrated AI module that helps users choose the best products.
* Intelligent ranking & suggestion system.

### ✅ **E-Commerce Modules**

* Users
* Products
* Categories & Sub-categories
* Brands
* Cart
* Orders
* Coupons

### ✅ **Order & Payment System**

* Full order lifecycle (create, update, complete).
* Inventory/stock auto-update on each order.
* Cart cleanup after successful checkout.
* **Stripe integration** with checkout session + webhook handling.

### ✅ **Database Optimization**

* MongoDB with **indexes** for optimal query performance.
* Efficient aggregation & filtering.

### ✅ **API Quality & Validation**

* DTO validation with class-validator.
* Centralized error handling.
* Consistent API responses.

### ✅ **DevOps Ready**

* Environment-based configuration.
* Ready for cloud deployment.

---

## 📂 Folder Structure

```
src/
 ├── common/
 ├── DB/
 ├── modules/
 │    ├── brand/
 │    ├── cart/
 │    ├── category/
 │    ├── coupon/
 │    ├── order/
 │    ├── product/
 │    ├── sub-category/
 │    └── user/
 ├── app.module.ts
 ├── main.ts
```

---

## ⚙️ Installation

```bash
git clone https://github.com/AKRAMELGYAR/NeoStore
cd NeoStore
npm install
```

Create an environment file:

```
PORT=3000
MONGO_URI=...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
AI_API_KEY=...
```

---

## ▶️ Run the Project

### Development

```bash
npm run start:dev
```

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker-compose up --build
```

---

## 🧠 AI Recommendation Engine

* Helps users find the best product.
* Uses metadata, product ranking, and behavioral insights.
* Integrated into the product service for seamless suggestions.

---

## 💳 Stripe Payment Flow

* Creates a checkout session.
* Validates payment via webhook.
* Auto-creates order & updates stock.
* Clears the user cart after successful payment.

---


## 👤 Author

**Akram Elgyar**

* GitHub: [AKRAMELGYAR](https://github.com/AKRAMELGYAR)
* Backend Engineer – Node.js · NestJS · TypeScript
