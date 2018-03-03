'use strict';

const supertestProvider = require('test/utils/supertestProvider');


describe('/', () => {

  const request = supertestProvider();

  it('should return a status 200 response', done => {
    request
      .get('/')
      .expect(200, done);
  });

});
