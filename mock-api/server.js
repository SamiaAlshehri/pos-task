const jsonServer = require('json-server');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');

// Configuration constants
const CONFIG = {
  PORT: process.env.PORT || 4200,
  SECRET_KEY: 'your-secret-key', // In production, use environment variable
  JWT_EXPIRES_IN: '1h',
  DB_FILE: 'db.json'
};

// Initialize JSON Server
const server = jsonServer.create();
const router = jsonServer.router(CONFIG.DB_FILE);

// Bind the router db to the app for custom routes access
server.db = router.db;

// =======================
// JWT Authentication Middleware
// =======================
/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, CONFIG.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// =======================
// Global Middlewares
// =======================
server.use(cors());
server.use(jsonServer.bodyParser);
server.use(express.static('public'));

// =======================
// Static Routes
// =======================
server.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
server.get('/products', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    // API request
    authenticateToken(req, res, () => {
      const tenantId = req.user.tenant_id;
      let products = server.db.get('products').value();
      if (tenantId) {
        products = products.filter(product => product.tenantId === tenantId);
      }
      res.json(products);
    });
  } else {
    // Page request
    res.sendFile(__dirname + '/public/products.html');
  }
});
server.get('/checkout', (req, res) => res.sendFile(__dirname + '/public/checkout.html'));
server.get('/sales-history', (req, res) => res.sendFile(__dirname + '/public/sales-history.html'));

server.get('/sales', authenticateToken, (req, res) => {
  const tenantId = req.user.tenant_id;
  let sales = server.db.get('sales').value();
  if (tenantId) {
    sales = sales.filter(sale => sale.tenantId === tenantId);
  }
  res.json(sales);
});

// =======================
// Authentication Routes
// =======================
/**
 * POST /auth/login
 * Authenticates user and returns JWT token
 */
server.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Find user in database
  const user = server.db.get('users').find({ username }).value();

  // Validate credentials
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create JWT payload
  const tokenPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
    tenant_id: user.tenantId
  };

  // Generate and return token
  const token = jwt.sign(tokenPayload, CONFIG.SECRET_KEY, { expiresIn: CONFIG.JWT_EXPIRES_IN });

  res.json({
    access_token: token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role
    }
  });
});

// =======================
// Protected API Routes
// =======================

/**
 * GET /sales/archive
 * Returns archived sales filtered by user's tenant
 */
server.get('/sales/archive', authenticateToken, (req, res) => {
  const tenantId = req.user.tenant_id;
  let archivedSales = server.db.get('salesArchive').value();

  // Filter archived sales by tenant
  if (tenantId) {
    archivedSales = archivedSales.filter(sale => sale.tenantId === tenantId);
  }

  res.json(archivedSales);
});

/**
 * POST /sales/:id/archive
 * Archives a specific sale by moving it from sales to salesArchive
 */
server.post('/sales/:id/archive', authenticateToken, (req, res) => {
  const saleId = Number(req.params.id);

  // Find the sale to archive
  const sale = server.db.get('sales').find({ id: saleId }).value();

  if (!sale) {
    return res.status(404).json({ message: "Sale not found" });
  }

  // Move sale to archive and remove from active sales
  server.db.get('salesArchive').push(sale).write();
  server.db.get('sales').remove({ id: saleId }).write();

  res.status(200).json({ message: "Sale archived successfully", sale });
});

// =======================
// Route Protection Middleware
// =======================
/**
 * Middleware to protect all routes except public ones
 */
server.use((req, res, next) => {
  const publicPaths = ['/auth/login'];

  // Apply authentication to all routes except public ones
  if (!publicPaths.includes(req.path)) {
    return authenticateToken(req, res, next);
  }

  next();
});

// Bind default JSON Server router for CRUD operations on all other routes
server.use(router);

// =======================
// Server Initialization
// =======================
/**
 * Start the server
 */
server.listen(CONFIG.PORT, () => {
  console.log(`JSON Server with Auth running on port ${CONFIG.PORT}`);
  console.log(`Database file: ${CONFIG.DB_FILE}`);
  console.log(`JWT Secret: ${CONFIG.SECRET_KEY.substring(0, 10)}...`);
});
