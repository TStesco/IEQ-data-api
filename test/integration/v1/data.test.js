/**
 * V1 Data tests
 */

'use strict';

const CallbackManager = require('es6-callback-manager');

const db = require('db');
const logger = require('logger');
const sinon = require('sinon');
const supertestProvider = require('test/utils/supertestProvider');


describe('/v1 Data', () => {

  const request = supertestProvider('/v1');

  function bodyIsAnErrorObject(result) {
    result.body.should.be.an.Object();
    result.body.should.have.ownProperty('error');
  }

  before(() => {
    sinon.stub(logger, 'error');
  });

  after(() => {
    logger.error.should.have.callCount(8);
    logger.error.restore();
  });

  describe('GET /device/:deviceID/data', () => {

    before(done => { // Insert 3000 rows for chronological selection tests
      var values = "(5000000000,'2015-01-01 00:00:00'),(5000000000,'2015-01-02 00:00:00')";
      for (var i = 3000; i < 6000; i++) {
        values += `,(5000000000,'${i}-01-01 00:00:00')`;
      }
      db.query('INSERT INTO `data` (`deviceID`,`created`) VALUES ' + values, done);
    });

    it('should respond with the most recent data for the device (max 3000 by default) in chronological order', done => {
      request
        .get('/device/5000000000/data')
        .expect(200, (err, result) => {
          result.body.should.be.an.Array();
          result.body.should.have.length(3000);
          result.body[0].should.have.keys([
            'created',
            'airFlow',
            'co2',
            'coal',
            'humidity',
            'light',
            'light_alt',
            'o2',
            'pm',
            'pm_alt',
            'pm_alt_2',
            'pressure',
            'sound',
            'temperature',
            'temperature_alt',
            'voc',
            'voc_alt',
          ]);
          result.body[0].created.should.startWith('3000-01-01');
          result.body[2999].created.should.startWith('5999-01-01');
          done(err);
        });
    });

    it('should respond with all data for the device in chronological order if limit is set to 0', done => {
      request
        .get('/device/5000000000/data?limit=0')
        .expect(200, (err, result) => {
          result.body.should.have.length(3002);
          result.body[0].created.should.startWith('2015-01-01');
          result.body[3001].created.should.startWith('5999-01-01');
          done(err);
        });
    });

    it('should respond with all offset data for the device in chronological order if limit is set to 0', done => {
      request
        .get('/device/5000000000/data?offset=1&limit=0')
        .expect(200, (err, result) => {
          result.body.should.have.length(3001);
          result.body[0].created.should.startWith('2015-01-01');
          result.body[3000].created.should.startWith('5998-01-01');
          done(err);
        });
    });

    it('should respond with the most recent limited amount of data for the device in chronological order', done => {
      request
        .get('/device/5000000000/data?limit=2')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('5998-01-01');
          result.body[1].created.should.startWith('5999-01-01');
          done(err);
        });
    });

    it('should respond with the most recent offset data for the device (max 3000 by default) in chronological order', done => {
      request
        .get('/device/5000000000/data?offset=2')
        .expect(200, (err, result) => {
          result.body.should.have.length(3000);
          result.body[0].created.should.startWith('2015-01-01');
          result.body[2999].created.should.startWith('5997-01-01');
          done(err);
        });
    });

    it('should respond with the most recent offset and limited amount of data for the device in chronological order', done => {
      request
        .get('/device/5000000000/data?limit=2&offset=10')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('5988-01-01');
          result.body[1].created.should.startWith('5989-01-01');
          done(err);
        });
    });

    it('should respond with the specified page of data for the device in chronological order', done => {
      request
        .get('/device/5000000000/data?page=1')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('2015-01-01');
          result.body[1].created.should.startWith('2');
          done(err);
        });
    });

    it('should respond with the specified page of data with an offset for the device', done => {
      request
        .get('/device/5000000000/data?page=1&offset=1')
        .expect(200, (err, result) => {
          result.body.should.have.length(1);
          result.body[0].created.should.startWith('2015-01-01');
          done(err);
        });
    });

    it('should respond with the limited page of data for the device in chronological order', done => {
      request
        .get('/device/5000000000/data?limit=2&page=1')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('5996-01-01');
          result.body[1].created.should.startWith('5997-01-01');
          done(err);
        });
    });

    it('should respond with the limited page of data with an offset for the device in chronological order', done => {
      request
        .get('/device/5000000000/data?limit=2&page=1&offset=1')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('5995-01-01');
          result.body[1].created.should.startWith('5996-01-01');
          done(err);
        });
    });

    it('should respond with data before the specified datetime in chronological order', done => {
      request
        .get('/device/5000000000/data?before=3001-01-01T00:00:00')
        .expect(200, (err, result) => {
          result.body.should.have.length(3);
          result.body[0].created.should.startWith('2015-01-01');
          result.body[2].created.should.startWith('3000-01-01');
          done(err);
        });
    });

    it('should respond with data before or on the specified datetime in chronological order', done => {
      request
        .get('/device/5000000000/data?before_inc=3000-01-01T00:00:00')
        .expect(200, (err, result) => {
          result.body.should.have.length(3);
          result.body[0].created.should.startWith('2015-01-01');
          result.body[2].created.should.startWith('3000-01-01');
          done(err);
        });
    });

    it('should respond with limited data before the specified datetime in chronological order', done => {
      request
        .get('/device/5000000000/data?before=3050-01-01T00:00:00&limit=2')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('3048-01-01');
          result.body[1].created.should.startWith('3049-01-01');
          done(err);
        });
    });

    it('should respond with limited data before or on the specified datetime in chronological order', done => {
      request
        .get('/device/5000000000/data?before_inc=3050-01-01T00:00:00&limit=2')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('3049-01-01');
          result.body[1].created.should.startWith('3050-01-01');
          done(err);
        });
    });

    it('should respond with data after the specified datetime in chronological order', done => {
      request
        .get('/device/5000000000/data?after=5997-01-01T00:00:00')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('5998-01-01');
          result.body[1].created.should.startWith('5999-01-01');
          done(err);
        });
    });

    it('should respond with data after or on the specified datetime in chronological order', done => {
      request
        .get('/device/5000000000/data?after_inc=5997-01-01T00:00:00')
        .expect(200, (err, result) => {
          result.body.should.have.length(3);
          result.body[0].created.should.startWith('5997-01-01');
          result.body[1].created.should.startWith('5998-01-01');
          result.body[2].created.should.startWith('5999-01-01');
          done(err);
        });
    });

    it('should respond with limited data after the specified datetime in chronological order', done => {
      request
        .get('/device/5000000000/data?after=5996-01-01T00:00:00&limit=2')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('5998-01-01');
          result.body[1].created.should.startWith('5999-01-01');
          done(err);
        });
    });

    it('should respond with limited data after or on the specified datetime in chronological order', done => {
      request
        .get('/device/5000000000/data?after_inc=5996-01-01T00:00:00&limit=2')
        .expect(200, (err, result) => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('5998-01-01');
          result.body[1].created.should.startWith('5999-01-01');
          done(err);
        });
    });

    it('should respond with data between or on the specified datetimes in chronological order', done => {
      const cbManager = new CallbackManager(done);

      request
        .get('/device/5000000000/data?after=3050-01-01T00:00:00&before=3053-01-01T00:00:00')
        .expect(200)
        .expect(result => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('3051-01-01');
          result.body[1].created.should.startWith('3052-01-01');
        })
        .end(cbManager.registerCallback());

      request
        .get('/device/5000000000/data?after_inc=3050-01-01T00:00:00&before=3052-01-01T00:00:00')
        .expect(200)
        .expect(result => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('3050-01-01');
          result.body[1].created.should.startWith('3051-01-01');
        })
        .end(cbManager.registerCallback());

      request
        .get('/device/5000000000/data?after=3050-01-01T00:00:00&before_inc=3052-01-01T00:00:00')
        .expect(200)
        .expect(result => {
          result.body.should.have.length(2);
          result.body[0].created.should.startWith('3051-01-01');
          result.body[1].created.should.startWith('3052-01-01');
        })
        .end(cbManager.registerCallback());

      request
        .get('/device/5000000000/data?after_inc=3050-01-01T00:00:00&before_inc=3052-01-01T00:00:00')
        .expect(200)
        .expect(result => {
          result.body.should.have.length(3);
          result.body[0].created.should.startWith('3050-01-01');
          result.body[1].created.should.startWith('3051-01-01');
          result.body[2].created.should.startWith('3052-01-01');
        })
        .end(cbManager.registerCallback());
    });

    it('should allow cross-origin requests from anywhere', done => {
      request
        .get('/device/5000000000/data?limit=1')
        .expect('Access-Control-Allow-Origin', '*', done);
    });

    it('should respond with no data for a device that does not exist', done => {
      request
        .get('/device/0/data')
        .expect(200, '[]', done);
    });

    it('should respond with a 400 Bad Request if the limit is invalid', done => {
      const cbManager = new CallbackManager(done);

      request
        .get('/device/5000000000/data?limit=a')
        .expect(400, /Invalid\b.*\blimit\b/i)
        .expect(bodyIsAnErrorObject)
        .end(cbManager.registerCallback());

      request
        .get('/device/5000000000/data?limit=-1')
        .expect(400, /Invalid\b.*\blimit\b/i)
        .expect(bodyIsAnErrorObject)
        .end(cbManager.registerCallback());

      request
        .get('/device/5000000000/data?limit=18446744073709551616')
        .expect(400, /Invalid\b.*\blimit\b/i)
        .expect(bodyIsAnErrorObject)
        .end(cbManager.registerCallback());
    });

    it('should respond with a 400 Bad Request if the offset is invalid', done => {
      const cbManager = new CallbackManager(done);

      request
        .get('/device/5000000000/data?offset=a')
        .expect(400, /Invalid\b.*\boffset\b/i)
        .expect(bodyIsAnErrorObject)
        .end(cbManager.registerCallback());

      request
        .get('/device/5000000000/data?offset=-1')
        .expect(400, /Invalid\b.*\boffset\b/i)
        .expect(bodyIsAnErrorObject)
        .end(cbManager.registerCallback());

      request
        .get('/device/5000000000/data?offset=18446744073709551616')
        .expect(400, /Invalid\b.*\boffset\b/i)
        .expect(bodyIsAnErrorObject)
        .end(cbManager.registerCallback());
    });

    it('should respond with a 500 Server Error if something goes wrong', done => {
      sinon.stub(db, 'query', function() {
        var cb = arguments[arguments.length - 1];
        cb(new Error());
      });

      request
        .get('/device/5000000000/data')
        .expect(500)
        .expect(bodyIsAnErrorObject)
        .end(err => {
          db.query.restore();
          done(err);
        });
    });


    describe('/:dataType', () => {

      it('should respond with the most recent, specified data for the device (max 3000 by default) in chronological order', done => {
        request
          .get('/device/5000000000/data/co2')
          .expect('Access-Control-Allow-Origin', '*')
          .expect(200, (err, result) => {
            result.body.should.be.an.Array();
            result.body.should.have.length(3000);
            result.body[0].should.have.keys('co2', 'created');
            result.body[0].created.should.startWith('3000-01-01');
            result.body[2999].created.should.startWith('5999-01-01');
            done(err);
          });
      });

      it('should respond with data for each of the allowed data types', done => {
        const dataTypes = [
          'deviceID',
          'created',
          'airFlow',
          'co2',
          'coal',
          'humidity',
          'light',
          'light_alt',
          'o2',
          'pm',
          'pm_alt',
          'pressure',
          'sound',
          'temperature',
          'voc',
          'voc_alt',
        ];
        const cbManager = new CallbackManager(done);
        dataTypes.forEach(dataType => {
          request
            .get('/device/5000000000/data/' + dataType + '?limit=1')
            .expect(200, new RegExp('"' + dataType + '"'), cbManager.registerCallback());
        });
      });

      it('should accept all of the selection query parameters', done => {
        const cbManager = new CallbackManager(done);

        request
          .get('/device/5000000000/data/co2?after=3050-01-01T00:00:00&before=3055-01-01T00:00:00&limit=2&offset=1')
          .expect(200)
          .expect(result => {
            result.body.should.have.length(2);
            result.body[0].created.should.startWith('3052-01-01');
            result.body[1].created.should.startWith('3053-01-01');
          })
          .end(cbManager.registerCallback());

        request
          .get('/device/5000000000/data/o2?after_inc=3050-01-01T00:00:00&before_inc=3052-01-01T00:00:00&limit=0')
          .expect(200)
          .expect(result => {
            result.body.should.have.length(3);
            result.body[0].created.should.startWith('3050-01-01');
            result.body[1].created.should.startWith('3051-01-01');
            result.body[2].created.should.startWith('3052-01-01');
          })
          .end(cbManager.registerCallback());

        request
          .get('/device/5000000000/data/voc?limit=2&page=1&offset=1')
          .expect(200)
          .expect(result => {
            result.body.should.have.length(2);
            result.body[0].created.should.startWith('5995-01-01');
            result.body[1].created.should.startWith('5996-01-01');
          })
          .end(cbManager.registerCallback());
      });

      it('should respond with a 400 Bad Request if the dataType is invalid', done => {
        request
          .get('/device/5000000000/data/fakeDataType')
          .expect(400, /Invalid data type/i)
          .expect(bodyIsAnErrorObject)
          .end(done);
      });

    });

  });

});
