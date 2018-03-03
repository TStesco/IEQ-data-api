/**
 * app.js
 *
 * Application entry point. Starts the server.
 */

'use strict';

const db = require('db');
const express = require('express');
const fs = require('fs');
const http = require('http');
const io = require('io');
const morgan = require('morgan');
const routers = require('./api/routers');

const app = express();
const server = http.createServer(app);

io.attach(server); // Initialize socket.io

app.disable('etag');
app.disable('x-powered-by');

/* istanbul ignore if: Don't want to log to console when testing */
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan(':remote-addr [:date] ":method :url HTTP/:http-version" :status ":referrer" ":user-agent"', {
      skip: (req, res) => res.statusCode < 400, // Only log errors
      stream: fs.createWriteStream(process.env.API_ACCESS_LOG || 'access.log', {flags: 'a'}),
    })
  );
}

// Use each of the API version routers
for (const version in routers) {
  app.use('/' + version, routers[version]);
}

// Make the root return status 200 to prove that the API is running
app.get('/', (req, res) => {
  res.sendStatus(200);
});

// Sync DB tables
db.sync(err => {
  if (err) throw err;

  // Start the server
  const port = process.env.PORT || 3000;
  const host = process.env.HOST;
  server.listen(port, host, () => {
    console.log(`Express server listening at http://localhost:${port}`);
    app.emit('start');
  });
});

module.exports = app;
