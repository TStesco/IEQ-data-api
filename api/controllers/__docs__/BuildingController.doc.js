/**
 * @api {get} /v1/buildings_zones Get Buildings & Zones
 * @apiVersion 1.0.0
 * @apiName GetBuildingsZones
 * @apiGroup Building
 *
 * @apiDescription
 * Gets the building names and their associated zones
 * (used for populating the sidebar menu).
 *
 * @apiExample Example usage
 *     http://api.atmena.com/v1/buildings_zones
 *
 * @apiSuccess {Object[]} buildingsData An array of data objects.
 *
 * @apiSuccessExample Success-Response
 *     HTTP 200 OK
 *     [
 *       {
 *         "name": "Building 1",
 *         "zones": [
 *           {
 *             "id": 1,
 *             "name": "Zone 1"
 *           },
 *           {
 *             "id": 2,
 *             "name": "Zone 2"
 *           }
 *         ],
 *       },
 *       {
 *         "name": "Building 2",
 *         "zones": [
 *           {
 *             "id": 3,
 *             "name": "Zone A"
 *           }
 *         ],
 *       }
 *     ]
 */
