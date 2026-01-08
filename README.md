# POS Task

This project is a Point of Sale (POS) system with a mock API and comprehensive testing setup.

## Features

- **Mock API Server**: Built with JSON Server, includes authentication, products, sales, and user management.
- **UI Testing**: Automated end-to-end tests using Playwright for the web interface.
- **API Testing**: Automated API tests using Newman with Postman collections.
- **CI/CD**: GitHub Actions workflows for automated testing on pushes and pull requests.

## Project Structure

- `mock-api/`: Main application with API server, UI, and Playwright tests.
- `newman and postman collection/`: Postman collection and environment files for API testing.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Running the API Server

```bash
cd mock-api
npm install
npm run dev
```

The server will start on http://localhost:4200.

### Running Playwright Tests

```bash
cd mock-api/playwright-tests
npm install
npm test
```

### Running Newman API Tests

```bash
npm install -g newman newman-reporter-html
newman run "newman and postman collection/POS API TEST.postman_collection.json" -e "newman and postman collection/pos.postman_environment.json" -r html --reporter-html-export report.html
```

### Manual API Testing with Postman

1. Import the collection `newman and postman collection/POS API TEST.postman_collection.json` and environment `newman and postman collection/pos.postman_environment.json` into Postman.
2. Set the active environment to "pos" (baseurl: http://localhost:4200).
3. Authenticate by running the "login-valid user" request under "lOGIN" > "Authentication" with credentials `{"username": "admin", "password": "Admin@123"}` to set the access token.
4. For API endpoints like `/products`, add the header `Accept: application/json` to receive JSON responses (otherwise, the server returns the HTML page).
5. Use Bearer Token authentication with `{{access_token}}` for protected endpoints.

## CI/CD

GitHub Actions are configured to:

- Run Playwright UI tests on pushes and pull requests to `main` and `master` branches.
- Run Newman API tests on pushes and pull requests to `main` and `master` branches.
- Upload test reports and screenshots as artifacts.

## Demo

Watch the POS system in action: [POS Test Video](pos%20test-٢٠٢٦-٠١-٠٨_٠٩.٢٠.٣٨.mp4)

## Technologies Used

- Node.js
- JSON Server
- Playwright
- Newman
- Postman
- GitHub Actions
