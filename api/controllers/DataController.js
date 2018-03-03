/**
 * Data Controller
 */

'use strict';

const Data = require('../models/Data');

const logger = require('logger');
const routers = require('../routers');

const DEFAULT_SELECT_LIMIT = 3000;

const v1 = routers.v1;

v1.get('/device/:deviceID/data/:dataType?', (req, res) => {
  const dataType = req.params.dataType || '*';
  const deviceID = req.params.deviceID;
  const options = req.query;

  if (!options.limit) {
    options.limit = DEFAULT_SELECT_LIMIT;
  } else if (options.limit === '0') {
    options.limit = null;
  }

  Data.select(dataType, deviceID, options, (err, rows) => {
    if (err) {
      logger.error(err);
      if (err.errno === 1064 || err.errno === 1327) {
        res.status(400).json({error: 'Invalid limit or offset value'});
      } else if (err.errno === 1054) {
        res.status(400).json({error: `Invalid data type '${dataType}'`});
      } else {
        res.status(500).json({error: 'Internal Server Error'});
      }
      return;
    }
    res.json(rows);
  });
});
