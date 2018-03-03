'use strict';

const db = require('db');

describe('db', () => {

  it('should be a working MySQL database connection', done => {
    db.query('SELECT 1 + 1 AS solution', (err, rows) => {
      if (err) throw err;
      rows[0].solution.should.equal('2');
      done();
    });
  });

});
