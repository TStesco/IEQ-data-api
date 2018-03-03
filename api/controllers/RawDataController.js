/**
 * Raw Data Controller
 */

'use strict';

const Data = require('../models/Data');
const RawData = require('../models/RawData');
const SensorDataConverter = require('class/SensorDataConverter');

const bodyParser = require('body-parser');
const io = require('io');
const logger = require('logger');
const routers = require('../routers');

const DEFAULT_SELECT_LIMIT = 3000;

const ioV1 = io.of('/v1/stream/sensorData');
const v1 = routers.v1;

ioV1.on('connection', socket => {
  socket.on('select', devices => {
    if (devices === 'all') {
      // TODO: Join the room for each of the user's devices
      return;
    }
    if (!(devices instanceof Array)) {
      devices = [devices];
    }
    for (var i = 0; i < devices.length; i++) {
      // TODO: Verify that the user owns the device (maybe beforehand union with owned devices)
      socket.join(devices[i]);
    }
  });
});

v1.post('/device/:deviceID/rawdata', bodyParser.urlencoded({extended: false}), (req, res) => {
  const deviceID = req.params.deviceID;
  const rawData = req.body;

  rawData.deviceID = deviceID;

  RawData.insert(rawData, err => {
    if (err) {
      logger.error(err);
      res.status(400).json({error: err.message});
      return;
    }
    res.set('Connection', 'close');
    res.status(204).end();

    const convertedData = SensorDataConverter.convertRawData(rawData);
    if (rawData.created) {
      convertedData.created = rawData.created;
    }
    convertedData.deviceID = deviceID;

    Data.insert(convertedData, err => {
      if (err) {
        logger.error(err);
        return;
      }
      convertedData.created = convertedData.created || new Date().toISOString();
      ioV1.to(deviceID).emit('newdata', convertedData);
    });
  });
});

// TODO: Remove when firmware is updated with the new URL
v1.post('/device/:deviceID/data/raw', bodyParser.urlencoded({extended: false}), (req, res) => {
  const deviceID = req.params.deviceID;
  const rawData = req.body;

  rawData.deviceID = deviceID;

  RawData.insert(rawData, err => {
    if (err) {
      logger.error(err);
      res.status(400).json({error: err.message});
      return;
    }
    res.set('Connection', 'close');
    res.status(204).end();

    const convertedData = SensorDataConverter.convertRawData(rawData);
    if (rawData.created) {
      convertedData.created = rawData.created;
    }
    convertedData.deviceID = deviceID;

    Data.insert(convertedData, err => {
      if (err) {
        logger.error(err);
        return;
      }
      convertedData.created = convertedData.created || new Date().toISOString();
      ioV1.to(deviceID).emit('newdata', convertedData);
    });
  });
});

v1.get('/device/:deviceID/rawdata/:dataType?', (req, res) => {
  const dataType = req.params.dataType || '*';
  const deviceID = req.params.deviceID;
  const options = req.query;

  if (!options.limit) {
    options.limit = DEFAULT_SELECT_LIMIT;
  } else if (options.limit === '0') {
    options.limit = null;
  }

  RawData.select(dataType, deviceID, options, (err, rows) => {
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
