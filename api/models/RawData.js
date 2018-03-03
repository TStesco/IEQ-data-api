/**
 * Raw Data Model
 */

'use strict';

const db = require('db');

const Type = db.Type;

const RawDataTable = db.defineTable('rawdata', {
  columns: {
    deviceID: Type.bigint().unsigned().notNull(),
    created: Type.datetime().notNull().default('CURRENT_TIMESTAMP'),
    airFlow: Type.smallint().unsigned(),
    co2: Type.smallint().unsigned(),
    coal: Type.smallint().unsigned(),
    humidity: Type.smallint().unsigned(),
    light: Type.smallint().unsigned(),
    light_alt: Type.smallint().unsigned(),
    o2: Type.smallint().unsigned(),
    pm: Type.smallint().unsigned(),
    pm_alt: Type.smallint().unsigned(),
    pm_alt_2: Type.smallint().unsigned(),
    pressure: Type.int(),
    sound: Type.smallint().unsigned(),
    temperature: Type.smallint().unsigned(),
    temperature_alt: Type.smallint().unsigned(),
    voc: Type.smallint().unsigned(),
    voc_alt: Type.smallint().unsigned(),
  },
  primaryKey: ['deviceID', 'created'],
  charset: 'ascii',
});

const MAIN_COLUMNS = db.escapeId(Object.keys(RawDataTable.schema.columns).slice(1)); // All columns except deviceID

module.exports = {
  insert(rowData, cb) {
    RawDataTable.insert(rowData, cb);
  },

  select(columns, deviceID, options, cb) {
    if (columns === '*') {
      columns = MAIN_COLUMNS;
    } else {
      columns = db.escapeId(columns) + (columns.indexOf('created') < 0 ? ',`created`' : '');
    }
    deviceID = db.escape(deviceID);
    var sql = 'SELECT ' + columns + ' FROM `rawdata` WHERE `deviceID` = ' + deviceID;

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
