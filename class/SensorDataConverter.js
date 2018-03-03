/**
 * SensorDataConverter
 */

'use strict';

const SAMPLE_TIME_MS = 30000; // 30 seconds
const VOLT_CONVERTER = 5 / 1023; // 1023 units = 5 volts

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const SensorDataConverter = {
  convertRawData(rawData) {
    return {
      airFlow: convertRawAirFlow(rawData.airFlow, rawData.temperature_alt),
      co2: convertRawCO2(rawData.co2),
      coal: convertRawCoal(rawData.coal),
      humidity: convertRawHumidity(rawData.humidity),
      light: convertRawLight(rawData.light),
      light_alt: convertRawLightAlt(rawData.light_alt),
      o2: convertRawO2(rawData.o2),
      pm: convertRawParticulateMatter(rawData.pm),
      pm_alt: convertRawParticulateMatterAlt(rawData.pm_alt),
      pm_alt_2: convertRawParticulateMatterAlt2(rawData.pm_alt_2),
      pressure: convertRawPressure(rawData.pressure),
      sound: convertRawSound(rawData.sound),
      temperature: convertRawTemperature(rawData.temperature),
      temperature_alt: convertRawTemperatureAlt(rawData.temperature_alt),
      voc: convertRawVOC(rawData.voc),
      voc_alt: convertRawVOCAlt(rawData.voc_alt),
    };
  },
};

// ================================= airFlow =================================

// Reference: https://github.com/moderndevice/Wind_Sensor/blob/master/WindSensor/WindSensor.ino

const ZERO_WIND_ADJUST = 0.5;
const MPH_TO_MPS_CONVERTER = 1609.34 / 3600;

function convertRawAirFlow(rawAirFlowValue, rawTemperatureValue) {
  if (rawAirFlowValue == null || rawTemperatureValue == null) {
    return null;
  }

  const rvWindVolts = rawAirFlowValue * VOLT_CONVERTER;
  const zeroWindADUnits = -0.0006 * rawTemperatureValue * rawTemperatureValue + 1.0727 * rawTemperatureValue + 47.172;
  const zeroWindVolts = zeroWindADUnits * VOLT_CONVERTER - ZERO_WIND_ADJUST;
  const mph = Math.pow((rvWindVolts - zeroWindVolts) / 0.23, 2.7265) || 0; // In case of NaN
  return mph * MPH_TO_MPS_CONVERTER;
}

// =================================== co2 ===================================

function convertRawCO2(rawValue) {
  if (rawValue == null) {
    return null;
  }

  return rawValue;
}

// =================================== coal ==================================

// Reference: http://www.seeedstudio.com/wiki/Grove_-_Gas_Sensor(MQ9)

const COAL_R0 = 1;

function convertRawCoal(rawValue) {
  if (rawValue == null || rawValue === 0) { // Prevent division by 0
    return null;
  }

  const measuredVolts = rawValue * VOLT_CONVERTER;
  const rsGas = (5 - measuredVolts) / measuredVolts;
  return rsGas / COAL_R0;
}

// ================================= humidity ================================

// Reference: https://github.com/adafruit/Adafruit_HTU21DF_Library/blob/master/Adafruit_HTU21DF.cpp#L73

function convertRawHumidity(rawValue) {
  if (rawValue == null) {
    return null;
  }

  const result = rawValue * 125 / 65536 - 6;
  return clamp(result, 0, 100); // Must be a percentage between 0 and 100
}

// ================================== light ==================================

function convertRawLight(rawValue) {
  if (rawValue == null) {
    return null;
  }

  return rawValue;
}

// ================================ light_alt ================================

// Reference: http://www.seeedstudio.com/wiki/Grove_-_Luminance_Sensor

const lightVoutValues = [
  0.0011498,
  0.0033908,
  0.011498,
  0.041803,
  0.15199,
  0.53367,
  1.3689,
  1.9068,
  2.3,
];
const luxValues = [
  1.0108,
  3.1201,
  9.8051,
  27.43,
  69.545,
  232.67,
  645.11,
  73.52,
  1000,
];

function convertRawLightAlt(rawValue) {
  if (rawValue == null) {
    return null;
  }

  const measuredVolts = rawValue * VOLT_CONVERTER;
  return fMultiMap(measuredVolts, lightVoutValues, luxValues, luxValues.length);
}

function fMultiMap(value, inValues, outValues, size) {
  // Make sure the value is within range
  // value = constrain(value, inValues[0], inValues[size - 1]);
  if (value <= inValues[0]) {
    return outValues[0];
  }
  if (value >= inValues[size - 1]) {
    return outValues[size - 1];
  }

  // Search right interval
  let pos = 1; // inValues[0] allready tested
  while (value > inValues[pos]) {
    pos++;
  }

  // This will handle all exact "points" in the inValues array
  if (value === inValues[pos]) {
    return outValues[pos];
  }

  // Interpolate in the right segment for the rest
  return (value - inValues[pos - 1]) * (outValues[pos] - outValues[pos - 1]) /
         (inValues[pos] - inValues[pos - 1]) +
         outValues[pos - 1];
}

// =================================== o2 ====================================

// Reference: http://www.seeedstudio.com/wiki/Grove_-_Gas_Sensor(O%E2%82%82)

const O2_CONVERTER = VOLT_CONVERTER * 10000 / (201 * 7.43);

function convertRawO2(rawValue) {
  if (rawValue == null) {
    return null;
  }

  return rawValue * O2_CONVERTER;
}

// =================================== pm ====================================

function convertRawParticulateMatter(rawValue) {
  if (rawValue == null) {
    return null;
  }

  // TODO
  return undefined;
}

// ================================= pm_alt ==================================

// Reference: https://github.com/Seeed-Studio/Grove_Dust_Sensor/blob/master/Grove_Dust_Sensor.ino

function convertRawParticulateMatterAlt(rawValue) {
  if (rawValue == null) {
    return null;
  }

  const ratio = rawValue / (SAMPLE_TIME_MS * 10); // low pulse occupancy time (%)
  return 1.1 * Math.pow(ratio, 3) - 3.8 * Math.pow(ratio, 2) + 520 * ratio + 0.62;
}

// ================================ pm_alt_2 =================================

function convertRawParticulateMatterAlt2(rawValue) {
  if (rawValue == null) {
    return null;
  }

  // TODO
  return undefined;
}

// ================================ pressure =================================

function convertRawPressure(rawValue) {
  if (rawValue == null) {
    return null;
  }

  return rawValue;
}

// ================================== sound ==================================

// Reference: http://www.robotshop.com/media/files/pdf/product-manual-1133.pdf

const SOUND_COEFF = VOLT_CONVERTER * 200;

function convertRawSound(rawValue) {
  if (rawValue == null || rawValue === 0) { // ln(0) is undefined
    return null;
  }

  return 16.801 * Math.log(rawValue * SOUND_COEFF) + 9.872;
}

// =============================== temperature ===============================

// Reference: https://github.com/adafruit/Adafruit_HTU21DF_Library/blob/master/Adafruit_HTU21DF.cpp#L46

function convertRawTemperature(rawValue) {
  if (rawValue == null) {
    return null;
  }

  return rawValue * 175.72 / 65536 - 46.85;
}

// ============================= temperature_alt =============================

// Reference: https://github.com/moderndevice/Wind_Sensor/blob/master/WindSensor/WindSensor.ino

function convertRawTemperatureAlt(rawValue) {
  if (rawValue == null) {
    return null;
  }

  return 0.00005 * Math.pow(rawValue, 2) - 0.16862 * rawValue + 90.754;
}

// =================================== voc ===================================

// Reference: http://sgx.cdistore.com/datasheets/e2v/MiCS-VZ-86%20and%20VZ-89%20rev%204.pdf

const VOC_COEFF = 1600 / 229;

function convertRawVOC(rawValue) {
  if (rawValue == null || rawValue < 13) {
    return null;
  }

  return (rawValue - 13) * VOC_COEFF + 400;
}

// ================================= voc_alt =================================

function convertRawVOCAlt(rawValue) {
  if (rawValue == null) {
    return null;
  }

  // TODO
  return undefined;
}

// ===========================================================================

module.exports = SensorDataConverter;
