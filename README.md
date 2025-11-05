# 💈 Haircut Booking System

A comprehensive RESTful API backend system for managing haircut salon appointments, built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [Usage](#usage)
- [Contributing](#contributing)

## 🎯 Overview

This system provides a complete backend solution for haircut salon management, allowing customers to book appointments, stylists to manage their schedules, staff to approve bookings, and cashiers to handle payments. The system supports multiple branches, services, and user roles with comprehensive authorization controls.

## ✨ Features

### Customer Features

- 👤 User registration and authentication
- 📅 Book appointments with preferred stylist or branch
- 🔄 View and cancel appointments
- ⭐ Leave reviews for completed services
- 📱 Track appointment status (pending, confirmed, completed, canceled)

### Stylist Features

- 📋 View assigned appointments
- ✅ Mark appointments as completed
- 🛠️ Update appointment services
- 📊 Manage schedule and availability

### Staff Features

- ✔️ Approve pending appointments
- 👥 Create appointments for walk-in customers
- 📈 View all appointments across branches
- 🔧 Manage branch operations

### Cashier Features

- 💰 Process payments for appointments
- 📝 Create and manage transactions
- 💳 Track payment status

### Admin Features

- 🎛️ Full system control
- 👨‍💼 Employee management (stylists, staff, cashiers)
- 🏢 Branch management
- 💼 Service management
- 📊 Complete appointment oversight

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt for password hashing
- **HTTPS:** SSL/TLS with Cloudflare certificates
- **Logging:** Morgan (development mode)
- **Date Handling:** Day.js
- **Development:** Nodemon for auto-reload

## 📁 Project Structure

```
haircut-booking/
├── app.js                      # Express app configuration
├── server.js                   # HTTPS server setup
├── package.json                # Dependencies and scripts
│
├── controllers/                # Request handlers
│   ├── appointmentController.js
│   ├── authController.js
│   ├── branchController.js
│   ├── cashierController.js
│   ├── employeeController.js
│   ├── reviewController.js
│   ├── serviceController.js
│   ├── staffController.js
│   ├── stylistController.js
│   ├── transactionController.js
│   └── userController.js
│
├── services/                   # Business logic layer
│   ├── appointmentService.js
│   ├── authService.js
│   ├── branchService.js
│   ├── cashierService.js
│   ├── employeeService.js
│   ├── reviewService.js
│   ├── serviceService.js
│   ├── staffService.js
│   ├── stylistService.js
│   ├── transactionService.js
│   └── userService.js
│
├── models/                     # Mongoose schemas
│   ├── Appointment.js
│   ├── Branch.js
│   ├── Cashier.js
│   ├── Review.js
│   ├── Service.js
│   ├── Staff.js
│   ├── Stylist.js
│   ├── Transaction.js
│   └── User.js
│
├── routes/                     # API routes
│   ├── appointmentRoute.js
│   ├── authRoute.js
│   ├── branchRoute.js
│   ├── cashierRoute.js
│   ├── employeeRoute.js
│   ├── reviewRoute.js
│   ├── serviceRoute.js
│   ├── staffRoute.js
│   ├── stylistRoute.js
│   ├── transactionRoute.js
│   └── userRoutes.js
│
├── middlewares/                # Custom middleware
│   └── authMiddleware.js
│
├── helpers/                    # Helper functions
│   ├── appointmentHelper.js
│   └── employeeHelper.js
│
├── utils/                      # Utility functions
│   ├── buildEmployeeFilter.js
│   └── userRoleUtils.js
│
├── tools/                      # Database seeding tools
│   └── seedUser.js
│
└── docs/                       # UML diagrams
    └── uml/
        ├── activity-diagrams/
        ├── bfd/
        ├── class-diagrams/
        ├── erd/
        ├── package-diagrams/
        ├── sequence-diagrams/
        └── ui-flow/
```

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/IzukiNo/Haircut-Booking.git
cd Haircut-Booking
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables))

4. **Start the server**

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Environment
NODE_ENV=dev                    # dev | prod

# MongoDB
MONGO_URL=mongodb://localhost:27017/haircut-booking

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server (Production)
PORT=443
HOST=0.0.0.0

# SSL Certificates (Production)
SSL_KEY_PATH=/etc/ssl/cloudflare/origin.key
SSL_CERT_PATH=/etc/ssl/cloudflare/origin.pem
```

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login user
GET    /api/auth/me              # Get current user info
```

### Users

```
GET    /api/users                # Get all users (Admin)
GET    /api/users/:id            # Get user by ID
PATCH  /api/users/:id            # Update user
DELETE /api/users/:id            # Delete user (Admin)
```

### Appointments

```
POST   /api/appointments                      # Create appointment (User)
POST   /api/appointments/force                # Force create appointment (Staff/Admin)
GET    /api/appointments                      # Get all appointments (Staff/Admin/Stylist)
GET    /api/appointments/me                   # Get user's appointments (User)
GET    /api/appointments/:id                  # Get appointment by ID (Staff/Admin)
PATCH  /api/appointments/:id/cancel           # Cancel appointment (User)
PATCH  /api/appointments/:id/approve          # Approve appointment (Staff/Admin)
PATCH  /api/appointments/:id/complete         # Complete appointment (Stylist/Admin)
PATCH  /api/appointments/:id/status           # Update appointment status (Admin)
PATCH  /api/appointments/:id/services         # Update appointment services (Stylist)
DELETE /api/appointments/:id                  # Delete appointment (Admin)
```

### Reviews

```
POST   /api/reviews                   # Create review (User)
GET    /api/reviews                   # Get all reviews
GET    /api/reviews/:id               # Get review by ID
PATCH  /api/reviews/:id               # Update review (User)
DELETE /api/reviews/:id               # Delete review (User/Admin)
```

### Services

```
POST   /api/services                  # Create service (Staff/Admin)
GET    /api/services                  # Get all services
GET    /api/services/:id              # Get service by ID
PATCH  /api/services/:id              # Update service (Staff/Admin)
DELETE /api/services/:id              # Delete service (Admin)
```

### Branches

```
POST   /api/branches                  # Create branch (Admin)
GET    /api/branches                  # Get all branches
GET    /api/branches/:id              # Get branch by ID
PATCH  /api/branches/:id              # Update branch (Admin)
DELETE /api/branches/:id              # Delete branch (Admin)
```

### Stylists

```
POST   /api/stylists                  # Create stylist (Admin)
GET    /api/stylists                  # Get all stylists
GET    /api/stylists/:id              # Get stylist by ID
PATCH  /api/stylists/:id              # Update stylist (Admin)
DELETE /api/stylists/:id              # Delete stylist (Admin)
```

### Staff

```
POST   /api/staffs                    # Create staff (Admin)
GET    /api/staffs                    # Get all staff
GET    /api/staffs/:id                # Get staff by ID
PATCH  /api/staffs/:id                # Update staff (Admin)
DELETE /api/staffs/:id                # Delete staff (Admin)
```

### Cashiers

```
POST   /api/cashiers                  # Create cashier (Admin)
GET    /api/cashiers                  # Get all cashiers
GET    /api/cashiers/:id              # Get cashier by ID
PATCH  /api/cashiers/:id              # Update cashier (Admin)
DELETE /api/cashiers/:id              # Delete cashier (Admin)
```

### Employees

```
GET    /api/employees                 # Get all employees (Admin/Staff)
GET    /api/employees/:id             # Get employee by ID
```

### Transactions

```
POST   /api/transactions              # Create transaction (Cashier/Admin)
GET    /api/transactions              # Get all transactions (Cashier/Admin)
GET    /api/transactions/:id          # Get transaction by ID
PATCH  /api/transactions/:id          # Update transaction (Cashier/Admin)
DELETE /api/transactions/:id          # Delete transaction (Admin)
```

## 🗄️ Database Models

### User

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  roles: [String] (enum: ['user', 'cashier', 'stylist', 'staff', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment

```javascript
{
  customerId: ObjectId (ref: User),
  stylistId: ObjectId (ref: Stylist, optional),
  serviceId: [ObjectId] (ref: Service),
  branchId: ObjectId (ref: Branch),
  approvedBy: ObjectId (ref: Staff, optional),
  date: Date,
  time: String,
  status: String (enum: ['pending', 'confirmed', 'canceled', 'completed']),
  note: String,
  transactionId: ObjectId (ref: Transaction, optional),
  isPaid: Boolean,
  createdAt: Date
}
```

### Service

```javascript
{
  name: String,
  description: String,
  price: Number (VND),
  status: Boolean,
  createdAt: Date
}
```

### Branch

```javascript
{
  name: String,
  address: String,
  phone: String,
  managerId: ObjectId (ref: Staff),
  createdAt: Date
}
```

### Review

```javascript
{
  appointmentId: ObjectId (ref: Appointment),
  customerId: ObjectId (ref: User),
  stylistId: ObjectId (ref: Stylist),
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

### Transaction

```javascript
{
  appointmentId: ObjectId (ref: Appointment),
  cashierId: ObjectId (ref: Cashier),
  amount: Number,
  paymentMethod: String (enum: ['cash', 'card', 'transfer']),
  status: String (enum: ['pending', 'completed', 'failed']),
  createdAt: Date
}
```

### Employee Models (Stylist, Staff, Cashier)

```javascript
{
  userId: ObjectId (ref: User),
  branchId: ObjectId (ref: Branch),
  hireDate: Date,
  salary: Number,
  status: Boolean,
  createdAt: Date
}
```

## 🔒 Authentication & Authorization

The system uses JWT-based authentication with role-based access control (RBAC).

### User Roles

- **user**: Regular customers who can book appointments
- **stylist**: Hair stylists who perform services
- **staff**: Branch staff who approve appointments and manage operations
- **cashier**: Handle payment processing
- **admin**: Full system access

### Protected Routes

Routes are protected using the `authMiddleware` which:

1. Validates JWT tokens
2. Checks user roles
3. Authorizes access based on required permissions

Example:

```javascript
router.post(
  "/appointments",
  authMiddleware(["user"]),
  appointmentController.createAppointment
);
```

## 💡 Usage

### Example: Creating an Appointment

**Request:**

```bash
POST /api/appointments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "stylistId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "serviceId": ["65f1a2b3c4d5e6f7g8h9i0j2"],
  "branchId": "65f1a2b3c4d5e6f7g8h9i0j3",
  "date": "2025-11-15",
  "time": "14:00",
  "note": "Prefer short haircut"
}
```

**Response:**

```json
{
  "status": 201,
  "message": "Đặt lịch hẹn thành công",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "customerId": "65f1a2b3c4d5e6f7g8h9i0j0",
    "stylistId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "serviceId": ["65f1a2b3c4d5e6f7g8h9i0j2"],
    "branchId": "65f1a2b3c4d5e6f7g8h9i0j3",
    "date": "2025-11-15T00:00:00.000Z",
    "time": "14:00",
    "status": "pending",
    "note": "Prefer short haircut",
    "isPaid": false,
    "createdAt": "2025-11-05T10:30:00.000Z"
  }
}
```

### Example: Login

**Request:**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j0",
      "username": "johndoe",
      "email": "user@example.com",
      "roles": ["user"]
    }
  }
}
```

## 🏗️ Development

### Running in Development Mode

```bash
npm run dev
```

This starts the server with:

- Nodemon for auto-reload
- Morgan logging enabled
- Development environment variables

### Running in Production Mode

```bash
npm start
```

This starts the server with:

- HTTPS enabled
- Cloudflare SSL certificates
- Production optimizations

## 📝 API Response Format

All API responses follow a consistent format:

```javascript
{
  status: Number,        // HTTP status code
  message: String,       // Response message
  data: Object | null    // Response data or null on error
}
```

### Success Response Example

```json
{
  "status": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response Example

```json
{
  "status": 400,
  "message": "Invalid parameters",
  "data": null
}
```

## 🔧 Key Features Implementation

### Conflict Prevention

- Prevents double-booking of stylists at the same time slot
- Ensures customers can only have one active appointment
- Validates appointment availability before creation

### Status Workflow

```
pending → confirmed → completed
           ↓
        canceled
```

### Pagination Support

Most GET endpoints support pagination:

```
GET /api/appointments?page=1&limit=10&status=pending
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**IzukiNo**

- GitHub: [@IzukiNo](https://github.com/IzukiNo)
- Repository: [Haircut-Booking](https://github.com/IzukiNo/Haircut-Booking)

## 🐛 Bug Reports

Please report bugs at: [https://github.com/IzukiNo/Haircut-Booking/issues](https://github.com/IzukiNo/Haircut-Booking/issues)

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---
