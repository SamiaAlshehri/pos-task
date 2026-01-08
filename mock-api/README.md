# Mock API Nerdpos

A mock API server for Nerdpos using JSON Server with JWT authentication.

## Features

- User authentication with JWT tokens
- Protected routes for products and sales
- Tenant-based data filtering
- Sale archiving functionality

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

- Start the server in production mode:
  ```bash
  npm start
  ```

- Start the server in development mode (with nodemon):
  ```bash
  npm run dev
  ```

The server will run on port 3001 by default (or the port specified in the `PORT` environment variable).

## API Endpoints

### Authentication
- `POST /auth/login` - Login with username and password
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: JWT token and user info

### Protected Routes (require authentication)
- `GET /products` - Retrieve products filtered by tenant
- `GET /sales/archive` - Retrieve archived sales filtered by tenant
- `POST /sales/:id/archive` - Archive a specific sale

All other JSON Server routes are also protected and require authentication.

## Database

The application uses `db.json` as the data store, managed by JSON Server.

## Dependencies

- json-server: REST API server
- json-server-auth: Authentication middleware
- bcrypt: Password hashing
- jsonwebtoken: JWT token handling
- cors: Cross-origin resource sharing
- nodemon: Development auto-restart (dev dependency)

## Environment

Requires Node.js >= 18