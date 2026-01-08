# Playwright UI Tests for POS Angular App

This folder contains Playwright tests for the POS (Point of Sale) Angular application.

## Prerequisites

- Node.js >= 18
- The mock API server running (from parent directory)
- The Angular POS frontend running on `http://localhost:4200`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

npm start
- Run all tests (headless by default):
  ```bash
  npm test
  ```

- Run tests in headed mode (visible browser):
  ```bash
  npm run test:headed
  ```

- Run tests with UI mode:
  ```bash
  npm run test:ui
  ```

## CI/CD

Tests are automatically run on GitHub Actions for pushes and pull requests to main/master branches. The workflow installs dependencies, sets up browsers, and runs tests in headless mode. Reports are uploaded as artifacts.

## Test Scenarios

The test suite includes:

- **Login**: Authenticate with username and password
- **Create Sale**: Add two products to cart and complete the sale
- **Verify History**: Check that the sale appears in the sales history

Screenshots are captured at key points and saved in the `screenshots` folder.

## Configuration

- Base URL: `http://localhost:4200` (Angular app)
- Mock API: Automatically started on port 3001
- Browsers: Chromium, Firefox, WebKit

## Notes

- The test assumes specific selectors and page structures. Adjust the test file if the frontend implementation differs.
- User credentials: username `user2`, password `password` (note: password is hashed in db.json, but test uses plain for simplicity; adjust if needed).
- Products used: حليب طازج (Milk) and خبز عربي (Arabic Bread)