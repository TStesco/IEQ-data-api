/**
 * V1 Router
 */

'use strict';

const express = require('express');
const router = express.Router();

// Allow all cross-origin GET requests
router.use((req, res, next) => {
  if (req.method === 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  next();
});

module.exports = router;
