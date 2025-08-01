# Online Movie Ticket Booking System API Documentation

This document provides a comprehensive guide to the backend API for the Online Movie Ticket Booking System platform.

## Base URL
All API endpoints are prefixed with `/api`.
- Development: http://localhost:5002/api (adjust as per your environment)

## Authentication
Some routes require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Authentication & User Management (`/api`)

### 1.1 Signup (Send OTP)
- **Endpoint:** `POST /api/signup`
- **Description:** Sends OTP to user for signup.
- **Request Body:**
  ```json
  { "email_or_phone": "user@example.com" }
  ```
- **Response:**
  ```json
  { "message": "OTP sent", "otp": "123456" }
  ```

### 1.2 Verify Signup OTP
- **Endpoint:** `POST /api/verify-signup-otp`
- **Description:** Verifies OTP and creates user if not exists.
- **Request Body:**
  ```json
  { "email_or_phone": "user@example.com", "otp": "123456" }
  ```
- **Response:**
  ```json
  { "message": "Signup successful", "userId": 1, "access_token": "...", "refresh_token": "..." }
  ```

### 1.3 Login (Send OTP)
- **Endpoint:** `POST /api/login`
- **Description:** Sends OTP for login.
- **Request Body:**
  ```json
  { "email_or_phone": "user@example.com" }
  ```
- **Response:**
  ```json
  { "message": "OTP sent", "otp": "123456" }
  ```

### 1.4 Verify OTP (Login)
- **Endpoint:** `POST /api/verify-otp`
- **Description:** Verifies OTP for login.
- **Request Body:**
  ```json
  { "email_or_phone": "user@example.com", "otp": "123456" }
  ```
- **Response:**
  ```json
  { "message": "OTP verified", "success": true, "user": { ... } }
  ```

### 1.5 Get All Users
- **Endpoint:** `GET /api/users`
- **Access:** Admin

### 1.6 Get User by ID
- **Endpoint:** `GET /api/users/:id`
- **Access:** Private

### 1.7 Update User
- **Endpoint:** `PUT /api/users/:id`
- **Request Body:**
  ```json
  { "email_or_phone": "new@example.com" }
  ```

### 1.8 Delete User
- **Endpoint:** `DELETE /api/users/:id`

---

## 2. Movies (`/api/movies`)

### 2.1 List All Movies
- **Endpoint:** `GET /api/movies`

### 2.2 Get Movie by ID
- **Endpoint:** `GET /api/movies/:id`

### 2.3 Add Movie
- **Endpoint:** `POST /api/movies`
- **Request Body:** Movie details

### 2.4 Update Movie
- **Endpoint:** `PUT /api/movies/:id`
- **Request Body:** Movie details

### 2.5 Delete Movie
- **Endpoint:** `DELETE /api/movies/:id`

---

## 3. Showtimes (`/api/showtimes`)

### 3.1 List All Showtimes
- **Endpoint:** `GET /api/showtimes`

### 3.2 Get Showtimes for Movie
- **Endpoint:** `GET /api/showtimes/movie/:id`

### 3.3 Get Showtime by ID
- **Endpoint:** `GET /api/showtimes/:id`

### 3.4 Add Showtime
- **Endpoint:** `POST /api/showtimes`
- **Request Body:** Showtime details

### 3.5 Update Showtime
- **Endpoint:** `PUT /api/showtimes/:id`
- **Request Body:** Showtime details

### 3.6 Delete Showtime
- **Endpoint:** `DELETE /api/showtimes/:id`

---

## 4. Seats (`/api/seats`)

### 4.1 Get Seats for Showtime
- **Endpoint:** `GET /api/seats/:showtimeId`

### 4.2 Book Seats
- **Endpoint:** `POST /api/seats/book`
- **Request Body:**
  ```json
  { "showtimeId": 1, "seatNumbers": ["A1", "A2"] }
  ```

---

## 5. Payments & Bookings (`/api/payments`)

### 5.1 List All Payments/Bookings
- **Endpoint:** `GET /api/payments`

### 5.2 Create Payment/Booking
- **Endpoint:** `POST /api/payments`
- **Request Body:** Payment details

### 5.3 Cancel Booking (Wants Refund)
- **Endpoint:** `PUT /api/payments/:id/cancel`

### 5.4 Delete Payment/Booking
- **Endpoint:** `DELETE /api/payments/:id`

---

## 6. Offers (`/api/offers`)

### 6.1 List All Offers
- **Endpoint:** `GET /api/offers`

### 6.2 Get Offer by ID
- **Endpoint:** `GET /api/offers/:id`

### 6.3 Add Offer
- **Endpoint:** `POST /api/offers`
- **Request Body:** Offer details

### 6.4 Update Offer
- **Endpoint:** `PUT /api/offers/:id`
- **Request Body:** Offer details

### 6.5 Delete Offer
- **Endpoint:** `DELETE /api/offers/:id`

---

## 7. Banner & Homepage (`/api/homepage-banner`, `/api/banner-details`)

### 7.1 List All Banners
- **Endpoint:** `GET /api/homepage-banner`

### 7.2 Get Banner by ID
- **Endpoint:** `GET /api/homepage-banner/:id`

### 7.3 Add Banner
- **Endpoint:** `POST /api/homepage-banner`
- **Request Body:** Banner details

### 7.4 Update Banner
- **Endpoint:** `PUT /api/homepage-banner/:id`
- **Request Body:** Banner details

### 7.5 Delete Banner
- **Endpoint:** `DELETE /api/homepage-banner/:id`

### 7.6 Banner Details
- **Endpoint:** `GET /api/banner-details`
- **Endpoint:** `GET /api/banner-details/:id`
- **Endpoint:** `POST /api/banner-details`
- **Endpoint:** `PUT /api/banner-details/:id`

---

## Error Handling
All endpoints return appropriate HTTP status codes and error messages in the response body.

---

This file can be opened in Microsoft Word or Google Docs for further formatting or copy-paste into a `.docx` file.
