'use strict';

/*
 * Here the BME280 is configured to run in 'normal' mode using oversampling
 * and filtering options recommended by the BME280 datasheet for gaming.
 */

const bme280 = require('../');

const round = f => (Math.round(f * 100) / 100).toFixed(2);
const delay = millis => new Promise(resolve => setTimeout(resolve, millis));

const reportContinuous = async _ => {
  try {
    const sensor = await bme280.open({
      i2cBusNumber: 1,
      i2cBusAddress: 0x77,
      humidityOversampling: bme280.OVERSAMPLE.SKIPPED,
      pressureOversampling: bme280.OVERSAMPLE.X4,
      temperatureOversampling: bme280.OVERSAMPLE.X1,
      filterCoefficient: bme280.FILTER.F16
    });

    for (let i = 1; ; ++i) {
      const reading = await sensor.read();
      console.log(
        `${i} ` +
        `${round(reading.temperature)}°C, ` +
        `${round(reading.pressure)} hPa`
      );
      await delay(sensor.typicalMeasurementTime());
    }
  } catch (e) {
    console.log(e.stack);
  }
};

reportContinuous();

