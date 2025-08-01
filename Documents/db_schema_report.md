# Database Schema Report

## Overview
The database uses MySQL and consists of the following tables:
- users
- movies
- showtimes
- seats
- bookings
- payments
- offers
- banners

## Table Creation Queries

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Movies Table
```sql
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  genre VARCHAR(100),
  duration INT,
  release_date DATE,
  language VARCHAR(50),
  poster_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Showtimes Table
```sql
CREATE TABLE showtimes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT,
  show_date DATE,
  show_time TIME,
  theater VARCHAR(100),
  screen VARCHAR(50),
  price DECIMAL(10,2),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);
```

### Seats Table
```sql
CREATE TABLE seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  showtime_id INT,
  seat_number VARCHAR(10),
  is_booked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  showtime_id INT,
  seat_id INT,
  status ENUM('booked', 'cancelled', 'refunded', 'pending') DEFAULT 'booked',
  booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id),
  FOREIGN KEY (seat_id) REFERENCES seats(id)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  user_id INT,
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  status ENUM('paid', 'pending', 'failed', 'refunded', 'wants_refund') DEFAULT 'pending',
  payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Offers Table
```sql
CREATE TABLE offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  discount_percent DECIMAL(5,2),
  valid_from DATE,
  valid_to DATE
);
```

### Banners Table
```sql
CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255),
  link VARCHAR(255),
  description TEXT
);
```

---

For more details, see the DBML schema in the README folder.
