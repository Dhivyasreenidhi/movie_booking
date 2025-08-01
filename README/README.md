# Online Movie Ticket Booking System

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing & Deployment](#testing--deployment)
- [Contributors](#contributors)
- [License](#license)

## Overview
The Online Movie Ticket Booking System is a full-stack web application that allows users to browse movies, book tickets, manage bookings, and for admins to manage movies, showtimes, payments, and users. It supports secure authentication, payment processing, and robust admin features.

## Features
- User registration, login, and OTP verification
- Browse movies and showtimes
- Book and cancel tickets
- Payment and refund management
- Admin dashboard for managing movies, showtimes, users, and payments
- Responsive UI with modern design
- Toast notifications and confirmation dialogs
- Search, filter, and pagination for movies and bookings
- Unit testing and code coverage

## Tech Stack
- **Frontend:** Angular 19, Tailwind CSS, FontAwesome
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Testing:** Jasmine, Karma
- **Other:** Docker, JWT Authentication

## Architecture
- **Frontend:** SPA built with Angular, communicates with backend via RESTful APIs
- **Backend:** Express.js REST API, handles business logic, authentication, and database operations
- **Database:** MySQL stores users, movies, bookings, payments, showtimes, and banners
- **Deployment:** Dockerized backend, Angular build for production

## Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   ```
2. Install backend dependencies:
   ```sh
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```sh
   cd ../frontend/movie_booking
   npm install
   ```
4. Set up MySQL database and import schema from `backend/models/*.sql`
5. Configure environment variables as needed (e.g., JWT secret)

## Usage
- Start the backend server:
  ```sh
  cd backend
  node server.js
  ```
- Start the frontend Angular app:
  ```sh
  cd frontend/movie_booking
  ng serve --proxy-config proxy.conf.json
  ```
- Access the app at `http://localhost:4200`

## API Documentation
- RESTful endpoints under `/api/` (see backend/server.js for details)
- Example endpoints:
  - `POST /api/signup` - User signup with OTP
  - `POST /api/verify-otp` - OTP verification
  - `GET /api/movies` - List all movies
  - `POST /api/payments` - Create a payment/booking
  - `DELETE /api/payments/:id` - Delete a payment/booking
  - ...and more

## Database Schema
- See SQL files in `backend/models/` for table definitions:
  - `users`, `movies`, `showtimes`, `seats`, `payments`, `offers`, `banner_details`, `homepage_banner`
- Example: `create_movies_table.sql`, `create_payments_table.sql`

## Testing & Deployment
- **Testing:**
  - Run Angular unit tests:
    ```sh
    cd frontend/movie_booking
    ng test
    ```
  - Coverage reports in `frontend/movie_booking/testing-reports/`
- **Deployment:**
  - Use Docker for backend containerization
  - Build Angular app for production with `ng build --prod`

## Contributors
- Dhivyasreenidhi (Owner)
- [Add more contributors here]

## License
This project is licensed under the MIT License.
