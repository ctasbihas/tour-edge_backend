# Tour Edge Backend

Tour Edge Backend is a robust, scalable RESTful API built with Node.js, Express, TypeScript, and MongoDB. It powers a tour booking platform, supporting user authentication (including Google OAuth), tour management, division management, bookings, and payment integration with SSLCommerz.

---

## Table of Contents

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Environment Variables](#environment-variables)
-   [Scripts](#scripts)
-   [API Overview](#api-overview)
    -   [Authentication](#authentication)
    -   [User Management](#user-management)
    -   [Tour Management](#tour-management)
    -   [Division Management](#division-management)
    -   [Booking Management](#booking-management)
    -   [Payment Integration](#payment-integration)
-   [Validation & Error Handling](#validation--error-handling)
-   [Security](#security)
-   [Development](#development)
-   [License](#license)

---

## Features

-   **User Authentication:** Email/password and Google OAuth 2.0 login.
-   **Role-Based Access Control:** Supports `SUPER_ADMIN`, `ADMIN`, `USER`, and `GUIDE` roles.
-   **Tour Management:** CRUD for tours and tour types.
-   **Division Management:** CRUD for divisions (regions).
-   **Booking System:** Users can book tours, view their bookings, and admins can manage all bookings.
-   **Payment Integration:** SSLCommerz payment gateway for secure transactions.
-   **Robust Validation:** Uses Zod for request validation.
-   **Comprehensive Error Handling:** Centralized error handler for all API errors.
-   **Session Management:** Uses express-session and JWT for secure sessions and token management.
-   **Extensible:** Modular codebase for easy feature addition.

---

## Tech Stack

-   **Node.js** & **Express** (API server)
-   **TypeScript** (type safety)
-   **MongoDB** & **Mongoose** (database & ODM)
-   **Passport.js** (authentication)
-   **Zod** (validation)
-   **SSLCommerz** (payment gateway)
-   **Jest** (testing, recommended for future tests)
-   **ESLint** (linting)

---

## Project Structure

```
.
├── src/
│   ├── app.ts                # Express app setup
│   ├── server.ts             # Server entry point
│   └── app/
│       ├── config/           # Environment & passport config
│       ├── constants.ts      # Shared constants
│       ├── errorHelpers/     # Custom error classes
│       ├── interfaces/       # Global type declarations
│       ├── middlewares/      # Express middlewares
│       ├── modules/          # Main business logic (auth, user, tour, etc.)
│       ├── routes/           # API route definitions
│       └── utils/            # Utility functions (JWT, response, etc.)
├── .env                      # Environment variables (not committed)
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── ...
```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_uri
NODE_ENV=development
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES=1h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=7d
BCRYPT_SALT_ROUNDS=10
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=your_super_admin_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
EXPRESS_SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
SSL_STORE_ID=your_ssl_store_id
SSL_STORE_PASSWORD=your_ssl_store_password
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
```

---

## Scripts

-   **Start in development:**
    ```sh
    npm run dev
    ```
-   **Lint code:**
    ```sh
    npm run lint
    ```

---

## API Overview

### Authentication

-   `POST /api/v1/auth/login` — Login with email/password.
-   `POST /api/v1/auth/refresh-token` — Get new access token using refresh token.
-   `GET /api/v1/auth/logout` — Logout user (clears cookies).
-   `PATCH /api/v1/auth/reset-password` — Reset password (authenticated).
-   `GET /api/v1/auth/google` — Initiate Google OAuth login.
-   `GET /api/v1/auth/google/callback` — Google OAuth callback.

### User Management

-   `GET /api/v1/user/` — List all users (admin only).
-   `GET /api/v1/user/:email` — Get user by email (admin only).
-   `POST /api/v1/user/register` — Register a new user.
-   `PATCH /api/v1/user/:id` — Update user (role-based access).

### Tour Management

-   `GET /api/v1/tour/` — List all tours (admin only).
-   `GET /api/v1/tour/:slug` — Get tour by slug.
-   `POST /api/v1/tour/create` — Create a new tour (admin only).
-   `PATCH /api/v1/tour/:id` — Update tour (admin only).
-   `DELETE /api/v1/tour/:id` — Delete tour (admin only).
-   **Tour Types:**
    -   `GET /api/v1/tour/tour-types` — List all tour types.
    -   `POST /api/v1/tour/create-tour-type` — Create tour type (admin only).
    -   `PATCH /api/v1/tour/tour-types/:id` — Update tour type (admin only).
    -   `DELETE /api/v1/tour/tour-types/:id` — Delete tour type (admin only).

### Division Management

-   `GET /api/v1/division/` — List all divisions.
-   `GET /api/v1/division/:slug` — Get division by slug.
-   `POST /api/v1/division/create` — Create division (admin only).
-   `PATCH /api/v1/division/:id` — Update division (admin only).
-   `DELETE /api/v1/division/:id` — Delete division (admin only).

### Booking Management

-   `POST /api/v1/booking/` — Create a booking (authenticated).
-   `GET /api/v1/booking/my-bookings` — Get current user's bookings.
-   `GET /api/v1/booking/` — List all bookings (admin only).
-   `GET /api/v1/booking/:bookingId` — Get booking by ID (role-based).
-   `PATCH /api/v1/booking/:bookingId/status` — Update booking status (role-based).

### Payment Integration

-   `GET /api/v1/payment/init-payment/:bookingId` — Initiate payment for a booking.
-   `POST /api/v1/payment/success` — Payment success callback (SSLCommerz).
-   `POST /api/v1/payment/fail` — Payment fail callback.
-   `POST /api/v1/payment/cancel` — Payment cancel callback.

---

## Validation & Error Handling

-   **Validation:** All incoming requests are validated using Zod schemas (see `*.validation.ts` files).
-   **Error Handling:** Centralized error handler ([`globalErrorHandler`](src/app/middlewares/globalErrorHandler.ts)) provides consistent error responses for validation, database, and application errors.

---

## Security

-   **Password Hashing:** Uses bcryptjs for secure password storage.
-   **JWT:** Access and refresh tokens for stateless authentication.
-   **Session Management:** Express-session for session-based auth (used with Passport).
-   **Role Checks:** Middleware ([`checkAuth`](src/app/middlewares/checkAuth.ts)) enforces role-based access.
-   **Input Validation:** Zod schemas prevent malformed data.
-   **CORS & Cookies:** Configured for secure cross-origin requests and HTTP-only cookies.

---

## Development

1. **Clone the repository**
2. **Install dependencies**
    ```sh
    npm install
    ```
3. **Configure environment variables** in `.env`
4. **Start the server**
    ```sh
    npm run dev
    ```
5. **Lint your code**
    ```sh
    npm run lint
    ```

---

## License

This project is licensed under the ISC License.

---

## Acknowledgements

-   [Express](https://expressjs.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Mongoose](https://mongoosejs.com/)
-   [Passport.js](http://www.passportjs.org/)
-   [Zod](https://zod.dev/)
-   [SSLCommerz](https://developer.sslcommerz.com/)

---

\*For more details, see the source code and
