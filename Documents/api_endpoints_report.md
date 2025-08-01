# API Endpoints Report

This document provides a comprehensive list of all API endpoints available in the Online Movie Ticket Booking System, including their methods, routes, request/response formats, and descriptions.

## User APIs
- **POST /api/users/register**: Register a new user
- **POST /api/users/login**: User login and JWT token generation
- **POST /api/users/verify-otp**: OTP verification for user
- **GET /api/users/profile**: Get user profile (auth required)

## Movie APIs
- **GET /api/movies**: List all movies
- **GET /api/movies/:id**: Get movie details
- **POST /api/movies**: Add a new movie (admin)
- **PUT /api/movies/:id**: Update movie details (admin)
- **DELETE /api/movies/:id**: Delete a movie (admin)

## Showtimes APIs
- **GET /api/showtimes**: List all showtimes
- **GET /api/showtimes/:id**: Get showtime details
- **POST /api/showtimes**: Add a new showtime (admin)
- **PUT /api/showtimes/:id**: Update showtime (admin)
- **DELETE /api/showtimes/:id**: Delete showtime (admin)

## Booking APIs
- **POST /api/bookings**: Create a new booking
- **GET /api/bookings/user/:userId**: Get bookings for a user
- **GET /api/bookings/:id**: Get booking details
- **PUT /api/bookings/:id/cancel**: Cancel a booking

## Payment APIs
- **POST /api/payments**: Make a payment
- **GET /api/payments/user/:userId**: Get payments for a user
- **GET /api/payments/:id**: Get payment details
- **DELETE /api/payments/:id**: Delete a payment (admin)

## Offers & Banners APIs
- **GET /api/offers**: List all offers
- **POST /api/offers**: Add a new offer (admin)
- **GET /api/banners**: List all banners
- **POST /api/banners**: Add a new banner (admin)

---

For detailed request/response formats, refer to the API documentation in the README folder.
