/**
 * Building Controller
 */

'use strict';

const routers = require('../routers');

const v1 = routers.v1;

v1.get('/buildings_zones', (req, res) => {
  res.json([
    {
      name: 'Building 1',
      zones: [
        {
          id: 1,
          name: 'Zone 1',
        },
        {
          id: 2,
          name: 'Zone 2',
        },
      ],
    },
    {
      name: 'Building 2',
      zones: [
        {
          id: 3,
          name: 'Zone A',
        },
        {
          id: 4,
          name: 'Zone B',
        },
        {
          id: 5,
          name: 'Zone C',
        },
      ],
    },
  ]);
});
