# <a name="apitop"></a>Atmena API v1.0.0

A RESTful API for storing and retrieving Atmena IAQ data

- [Building](#building)
  - [Get Buildings &amp; Zones](#get-buildings-&amp;-zones)
  
- [Data](#data)
  - [Get Data](#get-data)
  - [Get Specific Data](#get-specific-data)
  
- [RawData](#rawdata)
  - [Get Raw Data](#get-raw-data)
  - [Get Specific Raw Data](#get-specific-raw-data)
  - [Post Raw Data](#post-raw-data)
  


# Building

## Get Buildings &amp; Zones
[Back to top](#apitop)

<p>Gets the building names and their associated zones (used for populating the sidebar menu).</p>

**GET**
```
https://api.atmena.com/v1/buildings_zones
```

### Example usage

```
http://api.atmena.com/v1/buildings_zones
```

### Success 200

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| buildingsData | Object[] | <p>An array of data objects.</p> |

### Success-Response

```js
HTTP 200 OK
[
  {
    "name": "Building 1",
    "zones": [
      {
        "id": 1,
        "name": "Zone 1"
      },
      {
        "id": 2,
        "name": "Zone 2"
      }
    ],
  },
  {
    "name": "Building 2",
    "zones": [
      {
        "id": 3,
        "name": "Zone A"
      }
    ],
  }
]
```
# Data

## Get Data
[Back to top](#apitop)

<p>Gets the data for the specified device. Requests will always return the most recent data within the requested time frame and the returned data will always be in chronological order.</p>

**GET**
```
https://api.atmena.com/v1/device/:deviceID/data
```

### URL Parameters

| Field    | Type    | Description    |
|----------|---------|----------------|
| deviceID | number | <p>The unique ID for the IAQ device.</p> | 

### Query String Parameters

| Field    | Type    | Description    | Default    |
|----------|---------|----------------|------------|
| limit | number | **optional** <p>The maximum number of data points to retrieve. If set to <code>0</code>, the amount of data returned will not be limited.</p> | `3000` | 
| page | number | **optional** <p>The page offset.</p> | `0` | 
| offset | number | **optional** <p>The absolute offset. If <code>page</code> is set, it adds onto the page offset.</p> | `0` | 
| after | Date | **optional** <p>Only data created after this date will be retrieved.</p> |  | 
| after_inc | Date | **optional** <p>Only data created after or on this date will be retrieved.</p> |  | 
| before | Date | **optional** <p>Only data created before this date will be retrieved.</p> |  | 
| before_inc | Date | **optional** <p>Only data created before or on this date will be retrieved.</p> |  | 

### Example usage

```
http://api.atmena.com/v1/device/5000000000/data?after=2015-08-03T17:42:50
```

### Success 200

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| dataPoints | Object[] | <p>An array of data objects.</p> |
| &emsp;created | Date | <p>The time the data was sent from the device.</p> |
| &emsp;airFlow | number |  |
| &emsp;co2 | number |  |
| &emsp;coal | number |  |
| &emsp;humidity | number |  |
| &emsp;light | number |  |
| &emsp;light_alt | number |  |
| &emsp;o2 | number |  |
| &emsp;pm | number |  |
| &emsp;pm_alt | number |  |
| &emsp;pm_alt_2 | number |  |
| &emsp;pressure | number |  |
| &emsp;sound | number |  |
| &emsp;temperature | number |  |
| &emsp;temperature_alt | number |  |
| &emsp;voc | number |  |
| &emsp;voc_alt | number |  |

### Success-Response

```js
HTTP 200 OK
[
  {
    "created": "2015-08-03T06:50:28.000Z",
    "airFlow": 168,
    "co2": 301,
    "coal": 9,
    "humidity": 34838,
    "light": 0,
    "light_alt": 2,
    "o2": 474,
    "pm": null,
    "pm_alt": null,
    "pm_alt_2": null,
    "pressure": 96431,
    "sound": 19,
    "temperature": 26076,
    "temperature_alt": 481,
    "voc": 14,
    "voc_alt": null
  }
]
```

### Error 4xx

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| InvalidLimitOrOffset | Object | <p>The <code>limit</code> value or the <code>offset</code> value was invalid (not a natural number).</p> |
| InvalidDataType | Object | <p>The specified <code>dataType</code> was not one of the valid data types.</p> |

### Error-Response

```js
HTTP 400 Bad Request
{
  "error": "Invalid limit or offset value"
}
```
## Get Specific Data
[Back to top](#apitop)

<p>Gets a single type of data for the specified device. Requests will always return the most recent data within the requested time frame and the returned data will always be in chronological order.</p>

**GET**
```
https://api.atmena.com/v1/device/:deviceID/data/:dataType
```

### URL Parameters

| Field    | Type    | Description    |
|----------|---------|----------------|
| deviceID | number | <p>The unique ID for the IAQ device.</p> | 
| dataType | string | <p>A single type of data to retrieve (<code>co2</code>, <code>voc</code>, etc.).</p> | 

### Query String Parameters

| Field    | Type    | Description    | Default    |
|----------|---------|----------------|------------|
| limit | number | **optional** <p>The maximum number of data points to retrieve. If set to <code>0</code>, the amount of data returned will not be limited.</p> | `3000` | 
| page | number | **optional** <p>The page offset.</p> | `0` | 
| offset | number | **optional** <p>The absolute offset. If <code>page</code> is set, it adds onto the page offset.</p> | `0` | 
| after | Date | **optional** <p>Only data created after this date will be retrieved.</p> |  | 
| after_inc | Date | **optional** <p>Only data created after or on this date will be retrieved.</p> |  | 
| before | Date | **optional** <p>Only data created before this date will be retrieved.</p> |  | 
| before_inc | Date | **optional** <p>Only data created before or on this date will be retrieved.</p> |  | 

### Example usage

```
http://api.atmena.com/v1/device/5000000000/data/co2?after=2015-08-03T17:42:50
```

### Success 200

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| dataPoints | Object[] | <p>An array of data objects for the data type.</p> |
| &emsp;dataType | number | <p>Whatever <code>dataType</code> is.</p> |
| &emsp;created | Date | <p>The time the data was sent from the device.</p> |

### Success-Response

```js
HTTP 200 OK
[
  {
    "co2": 301,
    "created": "2015-08-03T06:50:28.000Z"
  },
  {
    "co2": 320,
    "created": "2015-08-03T06:50:58.000Z"
  }
]
```

### Error 4xx

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| InvalidLimitOrOffset | Object | <p>The <code>limit</code> value or the <code>offset</code> value was invalid (not a natural number).</p> |
| InvalidDataType | Object | <p>The specified <code>dataType</code> was not one of the valid data types.</p> |

### Error-Response

```js
HTTP 400 Bad Request
{
  "error": "Invalid limit or offset value"
}
```
# RawData

## Get Raw Data
[Back to top](#apitop)

<p>Gets the raw data for the specified device. Requests will always return the most recent data within the requested time frame and the returned data will always be in chronological order.</p>

**GET**
```
https://api.atmena.com/v1/device/:deviceID/rawdata
```

### URL Parameters

| Field    | Type    | Description    |
|----------|---------|----------------|
| deviceID | number | <p>The unique ID for the IAQ device.</p> | 

### Query String Parameters

| Field    | Type    | Description    | Default    |
|----------|---------|----------------|------------|
| limit | number | **optional** <p>The maximum number of data points to retrieve. If set to <code>0</code>, the amount of data returned will not be limited.</p> | `3000` | 
| page | number | **optional** <p>The page offset.</p> | `0` | 
| offset | number | **optional** <p>The absolute offset. If <code>page</code> is set, it adds onto the page offset.</p> | `0` | 
| after | Date | **optional** <p>Only data created after this date will be retrieved.</p> |  | 
| after_inc | Date | **optional** <p>Only data created after or on this date will be retrieved.</p> |  | 
| before | Date | **optional** <p>Only data created before this date will be retrieved.</p> |  | 
| before_inc | Date | **optional** <p>Only data created before or on this date will be retrieved.</p> |  | 

### Example usage

```
http://api.atmena.com/v1/device/5000000000/rawdata?after=2015-08-03T17:42:50
```

### Success 200

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| dataPoints | Object[] | <p>An array of data objects.</p> |
| &emsp;created | Date | <p>The time the data was sent from the device.</p> |
| &emsp;airFlow | number |  |
| &emsp;co2 | number |  |
| &emsp;coal | number |  |
| &emsp;humidity | number |  |
| &emsp;light | number |  |
| &emsp;light_alt | number |  |
| &emsp;o2 | number |  |
| &emsp;pm | number |  |
| &emsp;pm_alt | number |  |
| &emsp;pm_alt_2 | number |  |
| &emsp;pressure | number |  |
| &emsp;sound | number |  |
| &emsp;temperature | number |  |
| &emsp;temperature_alt | number |  |
| &emsp;voc | number |  |
| &emsp;voc_alt | number |  |

### Success-Response

```js
HTTP 200 OK
[
  {
    "created": "2015-08-03T06:50:28.000Z",
    "airFlow": 168,
    "co2": 301,
    "coal": 9,
    "humidity": 34838,
    "light": 0,
    "light_alt": 2,
    "o2": 474,
    "pm": null,
    "pm_alt": null,
    "pm_alt_2": null,
    "pressure": 96431,
    "sound": 19,
    "temperature": 26076,
    "temperature_alt": 481,
    "voc": 14,
    "voc_alt": null
  }
]
```

### Error 4xx

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| InvalidLimitOrOffset | Object | <p>The <code>limit</code> value or the <code>offset</code> value was invalid (not a natural number).</p> |
| InvalidDataType | Object | <p>The specified <code>dataType</code> was not one of the valid data types.</p> |

### Error-Response

```js
HTTP 400 Bad Request
{
  "error": "Invalid limit or offset value"
}
```
## Get Specific Raw Data
[Back to top](#apitop)

<p>Gets a single type of raw data for the specified device. Requests will always return the most recent data within the requested time frame and the returned data will always be in chronological order.</p>

**GET**
```
https://api.atmena.com/v1/device/:deviceID/rawdata/:dataType
```

### URL Parameters

| Field    | Type    | Description    |
|----------|---------|----------------|
| deviceID | number | <p>The unique ID for the IAQ device.</p> | 
| dataType | string | <p>A single type of data to retrieve (<code>co2</code>, <code>voc</code>, etc.).</p> | 

### Query String Parameters

| Field    | Type    | Description    | Default    |
|----------|---------|----------------|------------|
| limit | number | **optional** <p>The maximum number of data points to retrieve. If set to <code>0</code>, the amount of data returned will not be limited.</p> | `3000` | 
| page | number | **optional** <p>The page offset.</p> | `0` | 
| offset | number | **optional** <p>The absolute offset. If <code>page</code> is set, it adds onto the page offset.</p> | `0` | 
| after | Date | **optional** <p>Only data created after this date will be retrieved.</p> |  | 
| after_inc | Date | **optional** <p>Only data created after or on this date will be retrieved.</p> |  | 
| before | Date | **optional** <p>Only data created before this date will be retrieved.</p> |  | 
| before_inc | Date | **optional** <p>Only data created before or on this date will be retrieved.</p> |  | 

### Example usage

```
http://api.atmena.com/v1/device/5000000000/rawdata/co2?after=2015-08-03T17:42:50
```

### Success 200

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| dataPoints | Object[] | <p>An array of data objects for the data type.</p> |
| &emsp;dataType | number | <p>Whatever <code>dataType</code> is.</p> |
| &emsp;created | Date | <p>The time the data was sent from the device.</p> |

### Success-Response

```js
HTTP 200 OK
[
  {
    "co2": 301,
    "created": "2015-08-03T06:50:28.000Z"
  },
  {
    "co2": 320,
    "created": "2015-08-03T06:50:58.000Z"
  }
]
```

### Error 4xx

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| InvalidLimitOrOffset | Object | <p>The <code>limit</code> value or the <code>offset</code> value was invalid (not a natural number).</p> |
| InvalidDataType | Object | <p>The specified <code>dataType</code> was not one of the valid data types.</p> |

### Error-Response

```js
HTTP 400 Bad Request
{
  "error": "Invalid limit or offset value"
}
```
## Post Raw Data
[Back to top](#apitop)



**POST**
```
https://api.atmena.com/v1/device/:deviceID/rawdata
```

### URL Parameters

| Field    | Type    | Description    |
|----------|---------|----------------|
| deviceID | number | <p>The unique ID for the IAQ device.</p> | 

### Body Parameters

| Field    | Type    | Description    | Default    |
|----------|---------|----------------|------------|
| created | Date | **optional** <p>The time the data was sent from the device. Defaults to the current time.</p> |  | 
| airFlow | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| co2 | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| coal | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| humidity | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| light | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| light_alt | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| o2 | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| pm | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| pm_alt | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| pm_alt_2 | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| pressure | number | **optional** <p>32-bit signed integer</p> | `null` | 
| sound | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| temperature | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| temperature_alt | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| voc | number | **optional** <p>16-bit unsigned integer</p> | `null` | 
| voc_alt | number | **optional** <p>16-bit unsigned integer</p> | `null` | 

### Success-Response

```js
HTTP 204 OK
```

### Error 4xx

| Field    | Type    | Description              |
|----------|---------|--------------------------|
| InvalidParameter | Object | <p>One or more of the Body parameters was invalid.</p> |

### Error-Response

```js
HTTP 400 Bad Request
{
  "error": "Invalid data parameter 'co22'"
}
```
