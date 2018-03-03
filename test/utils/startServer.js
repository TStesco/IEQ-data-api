'use strict';

describe('Starting server...', () => {

  it('Server started', done => {
    const app = require('app'); // eslint-disable-line global-require
    app.once('start', done);
  });

});
