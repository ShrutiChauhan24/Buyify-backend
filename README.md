# Buyify Backend – REST API

The backend for **Buyify**, a full-stack clothing e-commerce application built using the MERN stack. It provides APIs for user authentication, product management, orders, payments and administrative operations.

## Live Demo

* **Frontend:** [Buyify](https://buyify-frontend.vercel.app)
* **Backend:** [Buyify API](https://buyify-backend.onrender.com)

## Features

* User authentication and authorization using JWT
* Google OAuth authentication
* Product management and inventory handling
* Shopping cart and order processing
* Razorpay payment integration
* Order tracking
* Admin operations for managing products and orders
* Cloudinary integration for image storage
* RESTful API architecture

## Tech Stack

* **Runtime:** Node.js
* **Backend:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose
* **Authentication:** JWT, Google OAuth
* **Payments:** Razorpay
* **Image Storage:** Cloudinary

## Project Structure

```text
Buyify-backend/
├── cloudinary/
├── config/
├── controllers/
├── db/
├── middleware/
├── models/
├── routes/
├── utils/
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

* Node.js
* npm
* MongoDB database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ShrutiChauhan24/Buyify-backend.git
```

2. Navigate to the project directory:

```bash
cd Buyify-backend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory and add the environment variables required by the application.

5. Start the server using the appropriate command from `package.json`.

For example:

```bash
npm start
```

## API

The backend provides REST API endpoints for authentication, products, orders, payments and administration.

Refer to the source code in the `routes/` and `controllers/` directories for the implemented endpoints.

## Environment Variables

Configure the environment variables required by the application, which may include:

* MongoDB connection URI
* JWT secret
* Google OAuth credentials
* Razorpay API credentials
* Cloudinary credentials
* Frontend URL
* Port

Use the exact variable names defined in your project. Never commit actual secrets or credentials.

## Frontend

The frontend is maintained in a separate repository:

[Buyify Frontend](https://github.com/ShrutiChauhan24/Buyify-frontend)

## Developer

**Shruti Chauhan**
Self-Taught Full-Stack MERN Developer
