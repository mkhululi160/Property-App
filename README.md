# 🏠 Property Listing App - MERN Stack Real Estate Platform

A full-featured property listing platform built with the MERN stack, allowing users to browse properties, schedule viewings, make secure payments, and manage listings.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Challenges & Solutions](#challenges--solutions)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ✨ Features

### User Features
- 🔐 **Authentication & Authorization**
  - User registration and login with JWT
  - Password encryption with bcrypt
  - Profile management and updates

- 🏠 **Property Management**
  - Browse properties with advanced search filters
  - View detailed property information
  - Interactive Google Maps integration
  - Image gallery with Cloudinary
  - Save favorite properties
  - Compare multiple properties

- 🔍 **Advanced Search Filters**
  - Search by keyword (title/description)
  - Price range (min/max)
  - Number of bedrooms and bathrooms
  - Area/square footage range
  - Property type (house, apartment, condo, etc.)
  - Location (city, state)
  - Amenities (parking, pool, gym, security, etc.)
  - Property status (for sale/for rent)
  - Multiple sort options (newest, price, rating)

- 📅 **Booking System**
  - Schedule property viewings
  - Real-time availability checking
  - Choose date and time slots
  - Manage bookings (view, cancel)
  - Email confirmation for bookings

- 💳 **Payment Integration**
  - Secure payments with Stripe
  - Payment for deposits and booking fees
  - Payment history tracking
  - Receipt generation

- ⭐ **Reviews & Ratings**
  - Write reviews with ratings (1-5 stars)
  - Add pros and cons
  - Mark reviews as helpful
  - Verified purchase badges
  - Average rating calculation

### Admin Features
- 📊 **Admin Dashboard**
  - View all properties
  - Create, edit, delete properties
  - Manage user bookings
  - View platform statistics
  - User management

### Technical Features
- 📱 **Responsive Design** - Works on all devices
- 🗺️ **Google Maps Integration** - Interactive property locations
- 📸 **Image Upload** - Drag & drop with Cloudinary
- 🔄 **Real-time Updates** - Instant feedback with optimistic UI
- 🎨 **Modern UI** - Tailwind CSS for beautiful design
- 🔒 **Secure** - JWT authentication, input validation, XSS protection

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching and caching
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **React Dropzone** - File uploads
- **React DatePicker** - Date selection
- **@stripe/stripe-js** - Payment processing
- **@react-google-maps/api** - Maps integration

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and optimization
- **Stripe** - Payment processing
- **Nodemailer** - Email notifications
- **Multer** - File upload handling

### DevOps & Tools
- **Git** - Version control
- **GitHub** - Code repository
- **VS Code** - IDE
- **Postman** - API testing
- **MongoDB Compass** - Database GUI

## 
