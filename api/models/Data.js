/**
 * Raw Data Model
 */

'use strict';

const db = require('db');

const Type = db.Type;

const DataTable = db.defineTable('data', {
  columns: {
    deviceID: Type.bigint().unsigned().notNull(),
    created: Type.datetime().notNull().default('CURRENT_TIMESTAMP'),
    airFlow: Type.double().unsigned(),
    co2: Type.smallint().unsigned(),
    coal: Type.float().unsigned(),
    humidity: Type.float().unsigned(),
    light: Type.int().unsigned(),
    light_alt: Type.int().unsigned(),
    o2: Type.float().unsigned(),
    pm: Type.smallint().unsigned(),
    pm_alt: Type.float().unsigned(),
    pm_alt_2: Type.float().unsigned(),
    pressure: Type.int(),
    sound: Type.float().unsigned(),
    temperature: Type.float(),
    temperature_alt: Type.float(),
    voc: Type.float().unsigned(),
    voc_alt: Type.float().unsigned(),
  },
  primaryKey: ['deviceID', 'created'],
  charset: 'ascii',
});

const MAIN_COLUMNS = db.escapeId(Object.keys(DataTable.schema.columns).slice(1)); // All columns except deviceID

const Data = {
  insert(rowData, cb) {
    DataTable.insert(rowData, cb);
  },

  select(columns, deviceID, options, cb) {
    if (columns === '*') {
      columns = MAIN_COLUMNS;
    } else {
      columns = db.escapeId(columns) + (columns.indexOf('created') < 0 ? ',`created`' : '');
    }
    deviceID = db.escape(deviceID);
    var sql = 'SELECT ' + columns + ' FROM `data` WHERE `deviceID` = ' + deviceID;

    if (options.after_inc) {
      sql += ' AND `created` >= ' + db.escape(options.after_inc);
    } else if (options.after) {
      sql += ' AND `created` > ' + db.escape(options.after);
    }
    if (options.before_inc) {
      sql += ' AND `created` <= ' + db.escape(options.before_inc);
    } else if (options.before) {
      sql += ' AND `created` < ' + db.escape(options.before);
    }

    if (options.page) {
      options.offset = options.page * options.limit + (+options.offset || 0);
    }

    if (options.limit || options.offset) {
      sql += ' ORDER BY `created` DESC'; // Select the most recent rows

      if (options.offset) {
        sql += ' LIMIT ' + (+options.offset) + ',' +
          (options.limit ? +options.limit : '18446744073709551615');
      } else {
        sql += ' LIMIT ' + (+options.limit);
      }

      // Must use a subquery so that the outer query can be ordered chronologically
      sql = 'SELECT * FROM (' + sql + ') `rows`';
    }

    sql += ' ORDER BY `created` ASC'; // Always select data in chronological order

    db.query(sql, cb);
  },
};

module.exports = Data;
