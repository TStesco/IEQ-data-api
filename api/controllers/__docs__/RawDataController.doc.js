/**
 * @api {post} /v1/device/:deviceID/rawdata Post Raw Data
 * @apiVersion 1.0.0
 * @apiName PostRawData
 * @apiGroup RawData
 *
 * @apiParam (URL) {number} deviceID The unique ID for the IAQ device.
 *
 * @apiParam (Body) {Date} [created] The time the data was sent from the device. Defaults to the current time.
 * @apiParam (Body) {number} [airFlow=null]     16-bit unsigned integer
 * @apiParam (Body) {number} [co2=null]         16-bit unsigned integer
 * @apiParam (Body) {number} [coal=null]        16-bit unsigned integer
 * @apiParam (Body) {number} [humidity=null]    16-bit unsigned integer
 * @apiParam (Body) {number} [light=null]       16-bit unsigned integer
 * @apiParam (Body) {number} [light_alt=null]   16-bit unsigned integer
 * @apiParam (Body) {number} [o2=null]          16-bit unsigned integer
 * @apiParam (Body) {number} [pm=null]          16-bit unsigned integer
 * @apiParam (Body) {number} [pm_alt=null]      16-bit unsigned integer
 * @apiParam (Body) {number} [pm_alt_2=null]    16-bit unsigned integer
 * @apiParam (Body) {number} [pressure=null]    32-bit signed integer
 * @apiParam (Body) {number} [sound=null]       16-bit unsigned integer
 * @apiParam (Body) {number} [temperature=null] 16-bit unsigned integer
 * @apiParam (Body) {number} [temperature_alt=null] 16-bit unsigned integer
 * @apiParam (Body) {number} [voc=null]         16-bit unsigned integer
 * @apiParam (Body) {number} [voc_alt=null]     16-bit unsigned integer
 *
 * @apiSuccessExample Success-Response
 *     HTTP 204 OK
 *
 * @apiError {Object} InvalidParameter One or more of the Body parameters was invalid.
 * @apiErrorExample Error-Response
 *     HTTP 400 Bad Request
 *     {
 *       "error": "Invalid data parameter 'co22'"
 *     }
 */

/**
 * @apiDefine RawDataGetQueryParamsAndErrors
 *
 * @apiParam (Query String) {number} [limit=3000] The maximum number of data points to retrieve.
 *     If set to `0`, the amount of data returned will not be limited.
 * @apiParam (Query String) {number} [page=0] The page offset.
 * @apiParam (Query String) {number} [offset=0] The absolute offset. If `page` is set, it adds onto the page offset.
 * @apiParam (Query String) {Date} [after] Only data created after this date will be retrieved.
 * @apiParam (Query String) {Date} [after_inc] Only data created after or on this date will be retrieved.
 * @apiParam (Query String) {Date} [before] Only data created before this date will be retrieved.
 * @apiParam (Query String) {Date} [before_inc] Only data created before or on this date will be retrieved.
 *
 * @apiError {Object} InvalidLimitOrOffset The `limit` value or the `offset` value was invalid (not a natural number).
 * @apiError {Object} InvalidDataType The specified `dataType` was not one of the valid data types.
 * @apiErrorExample Error-Response
 *     HTTP 400 Bad Request
 *     {
 *       "error": "Invalid limit or offset value"
 *     }
 */

/**
 * @api {get} /v1/device/:deviceID/rawdata Get Raw Data
 * @apiVersion 1.0.0
 * @apiName GetRawData
 * @apiGroup RawData
 *
 * @apiDescription
 * Gets the raw data for the specified device. Requests will always return the
 * most recent data within the requested time frame and the returned data will
 * always be in chronological order.
 *
 * @apiParam (URL) {number} deviceID The unique ID for the IAQ device.
 * @apiUse RawDataGetQueryParamsAndErrors
 *
 * @apiExample Example usage
 *     http://api.atmena.com/v1/device/5000000000/rawdata?after=2015-08-03T17:42:50
 *
 * @apiSuccess {Object[]} dataPoints An array of data objects.
 * @apiSuccess {Date} dataPoints.created The time the data was sent from the device.
 * @apiSuccess {number} dataPoints.airFlow
 * @apiSuccess {number} dataPoints.co2
 * @apiSuccess {number} dataPoints.coal
 * @apiSuccess {number} dataPoints.humidity
 * @apiSuccess {number} dataPoints.light
 * @apiSuccess {number} dataPoints.light_alt
 * @apiSuccess {number} dataPoints.o2
 * @apiSuccess {number} dataPoints.pm
 * @apiSuccess {number} dataPoints.pm_alt
 * @apiSuccess {number} dataPoints.pm_alt_2
 * @apiSuccess {number} dataPoints.pressure
 * @apiSuccess {number} dataPoints.sound
 * @apiSuccess {number} dataPoints.temperature
 * @apiSuccess {number} dataPoints.temperature_alt
 * @apiSuccess {number} dataPoints.voc
 * @apiSuccess {number} dataPoints.voc_alt
 *
 * @apiSuccessExample Success-Response
 *     HTTP 200 OK
 *     [
 *       {
 *         "created": "2015-08-03T06:50:28.000Z",
 *         "airFlow": 168,
 *         "co2": 301,
 *         "coal": 9,
 *         "humidity": 34838,
 *         "light": 0,
 *         "light_alt": 2,
 *         "o2": 474,
 *         "pm": null,
 *         "pm_alt": null,
 *         "pm_alt_2": null,
 *         "pressure": 96431,
 *         "sound": 19,
 *         "temperature": 26076,
 *         "temperature_alt": 481,
 *         "voc": 14,
 *         "voc_alt": null
 *       }
 *     ]
 */

/**
 * @api {get} /v1/device/:deviceID/rawdata/:dataType Get Specific Raw Data
 * @apiVersion 1.0.0
 * @apiName GetSpecificRawData
 * @apiGroup RawData
 *
 * @apiDescription
 * Gets a single type of raw data for the specified device. Requests will
 * always return the most recent data within the requested time frame and
 * the returned data will always be in chronological order.
 *
 * @apiParam (URL) {number} deviceID The unique ID for the IAQ device.
 * @apiParam (URL) {string} dataType A single type of data to retrieve (`co2`, `voc`, etc.).
 * @apiUse RawDataGetQueryParamsAndErrors
 *
 * @apiExample Example usage
 *     http://api.atmena.com/v1/device/5000000000/rawdata/co2?after=2015-08-03T17:42:50
 *
 * @apiSuccess {Object[]} dataPoints An array of data objects for the data type.
 * @apiSuccess {number} dataPoints.dataType Whatever `dataType` is.
 * @apiSuccess {Date} dataPoints.created The time the data was sent from the device.
 *
 * @apiSuccessExample Success-Response
 *     HTTP 200 OK
 *     [
 *       {
 *         "co2": 301,
 *         "created": "2015-08-03T06:50:28.000Z"
 *       },
 *       {
 *         "co2": 320,
 *         "created": "2015-08-03T06:50:58.000Z"
 *       }
 *     ]
 */
