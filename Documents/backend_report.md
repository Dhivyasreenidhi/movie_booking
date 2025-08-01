# Backend Report

## Overview
The backend is built using Node.js and Express, with MySQL as the database. It provides RESTful APIs for user management, movie listings, showtimes, bookings, payments, offers, and banners.

## Key Features
- JWT-based authentication
- OTP verification for user registration
- Role-based access (admin/user)
- Booking and payment management
- Offer and banner management
- Modular code structure (controllers, models, routes, middleware)

## Main Files
- `server.js`: Main entry point, sets up Express app and routes
- `controllers/`: Business logic for each resource
- `models/`: Database models and SQL queries
- `routes/`: API route definitions
- `middleware/`: Auth and error handling
- `config/db.js`: Database connection setup

## Security
- Passwords hashed using bcrypt
- JWT tokens for session management
- Input validation and error handling

## Deployment
- Dockerized for easy deployment
- Environment variables for configuration

---

For API details, see the API Endpoints Report.
