/**
 * SensorDataConverter tests
 */

'use strict';

const SensorDataConverter = require('class/SensorDataConverter');

const should = require('should');

should.Assertion.addChain('but');

describe('SensorDataConverter', () => {

  describe('.convertRawData()', () => {

    it('should return an object with all of the sensor data properties', () => {
      var sensorData = SensorDataConverter.convertRawData({co2: 20});
      sensorData.should.be.an.Object().and.have.keys([
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
    });

    it('should provide null values for null or undefined data', () => {
      var expected = {
        airFlow: null,
        co2: null,
        coal: null,
        humidity: null,
        light: null,
        light_alt: null,
        o2: null,
        pm: null,
        pm_alt: null,
        pm_alt_2: null,
        pressure: null,
        sound: null,
        temperature: null,
        temperature_alt: null,
        voc: null,
        voc_alt: null,
      };
      SensorDataConverter.convertRawData({}).should.deepEqual(expected);
      SensorDataConverter.convertRawData(expected).should.not.equal(expected).but.deepEqual(expected);
    });

    it('should correctly convert the airFlow raw value', () => {
      // Requires temperature_alt
      should.strictEqual(SensorDataConverter.convertRawData({airFlow: 50}).airFlow, null);
      should.strictEqual(SensorDataConverter.convertRawData({airFlow: 50, temperature_alt: null}).airFlow, null);

      // No air flow
      SensorDataConverter.convertRawData({airFlow: 0, temperature_alt: 470}).airFlow.should.equal(0);
      SensorDataConverter.convertRawData({airFlow: 1, temperature_alt: 470}).airFlow.should.equal(0);
      SensorDataConverter.convertRawData({airFlow: 20, temperature_alt: 470}).airFlow.should.equal(0);

      SensorDataConverter.convertRawData({airFlow: 50, temperature_alt: 0}).airFlow.should.equal(4.000602347416394);
      SensorDataConverter.convertRawData({airFlow: 400, temperature_alt: 470}).airFlow.should.equal(2.1348833788863235);
      SensorDataConverter.convertRawData({airFlow: 400, temperature_alt: 500}).airFlow.should.equal(1.258103411590484);
      SensorDataConverter.convertRawData({airFlow: 1023, temperature_alt: 470}).airFlow.should.equal(721.1287438720465);
    });

    it('should correctly convert the CO2 raw value', () => {
      SensorDataConverter.convertRawData({co2: 0}).co2.should.equal(0);
      SensorDataConverter.convertRawData({co2: 1}).co2.should.equal(1);
      SensorDataConverter.convertRawData({co2: 20}).co2.should.equal(20);
      SensorDataConverter.convertRawData({co2: 500}).co2.should.equal(500);
      SensorDataConverter.convertRawData({co2: 1023}).co2.should.equal(1023);
    });

    it('should correctly convert the coal raw value', () => {
      should.strictEqual(SensorDataConverter.convertRawData({coal: 0}).coal, null); // Handles division by 0
      SensorDataConverter.convertRawData({coal: 1}).coal.should.equal(1022);
      SensorDataConverter.convertRawData({coal: 20}).coal.should.equal(50.150000000000006);
      SensorDataConverter.convertRawData({coal: 500}).coal.should.equal(1.046);
      SensorDataConverter.convertRawData({coal: 1023}).coal.should.equal(0);
    });

    it('should correctly convert the humidity raw value', () => {
      SensorDataConverter.convertRawData({humidity: 0}).humidity.should.equal(0);
      SensorDataConverter.convertRawData({humidity: 1}).humidity.should.equal(0);
      SensorDataConverter.convertRawData({humidity: 1023}).humidity.should.equal(0);
      SensorDataConverter.convertRawData({humidity: 10000}).humidity.should.equal(13.073486328125);
      SensorDataConverter.convertRawData({humidity: 55000}).humidity.should.equal(98.9041748046875);
      SensorDataConverter.convertRawData({humidity: 65535}).humidity.should.equal(100);
    });

    it('should correctly convert the light raw value', () => {
      SensorDataConverter.convertRawData({light: 0}).light.should.equal(0);
      SensorDataConverter.convertRawData({light: 1}).light.should.equal(1);
      SensorDataConverter.convertRawData({light: 20}).light.should.equal(20);
      SensorDataConverter.convertRawData({light: 500}).light.should.equal(500);
      SensorDataConverter.convertRawData({light: 1023}).light.should.equal(1023);
    });

    it('should correctly convert the light_alt raw value', () => {
      SensorDataConverter.convertRawData({light_alt: 0}).light_alt.should.equal(1.0108);
      SensorDataConverter.convertRawData({light_alt: 1}).light_alt.should.equal(4.354312957175413);
      SensorDataConverter.convertRawData({light_alt: 20}).light_alt.should.equal(48.81437337646591);
      SensorDataConverter.convertRawData({light_alt: 100}).light_alt.should.equal(213.47543977397964);
      SensorDataConverter.convertRawData({light_alt: 500}).light_alt.should.equal(1000);
      SensorDataConverter.convertRawData({light_alt: 1023}).light_alt.should.equal(1000);
    });

    it('should correctly convert the O2 raw value', () => {
      SensorDataConverter.convertRawData({o2: 0}).o2.should.equal(0);
      SensorDataConverter.convertRawData({o2: 1}).o2.should.equal(0.03272724890183553);
      SensorDataConverter.convertRawData({o2: 20}).o2.should.equal(0.6545449780367106);
      SensorDataConverter.convertRawData({o2: 500}).o2.should.equal(16.363624450917765);
      SensorDataConverter.convertRawData({o2: 1023}).o2.should.equal(33.47997562657775);
    });

    it('should correctly convert the pm_alt raw value', () => {
      SensorDataConverter.convertRawData({pm_alt: 0}).pm_alt.should.equal(0.62);
      SensorDataConverter.convertRawData({pm_alt: 1}).pm_alt.should.equal(0.6217333332911111);
      SensorDataConverter.convertRawData({pm_alt: 20}).pm_alt.should.equal(0.6546666497781037);
      SensorDataConverter.convertRawData({pm_alt: 500}).pm_alt.should.equal(1.4866561162037037);
      SensorDataConverter.convertRawData({pm_alt: 1023}).pm_alt.should.equal(2.393155856837003);
    });

    it('should correctly convert the pressure raw value', () => {
      SensorDataConverter.convertRawData({pressure: 0}).pressure.should.equal(0);
      SensorDataConverter.convertRawData({pressure: 1}).pressure.should.equal(1);
      SensorDataConverter.convertRawData({pressure: 20}).pressure.should.equal(20);
      SensorDataConverter.convertRawData({pressure: 500}).pressure.should.equal(500);
      SensorDataConverter.convertRawData({pressure: 1023}).pressure.should.equal(1023);
    });

    it('should correctly convert the sound raw value', () => {
      should.strictEqual(SensorDataConverter.convertRawData({sound: 0}).sound, null); // Handles ln(0)
      SensorDataConverter.convertRawData({sound: 1}).sound.should.equal(9.489953879425608);
      SensorDataConverter.convertRawData({sound: 20}).sound.should.equal(59.821251807406206);
      SensorDataConverter.convertRawData({sound: 500}).sound.should.equal(113.90158454101685);
      SensorDataConverter.convertRawData({sound: 1023}).sound.should.equal(125.92919644217886);
    });

    it('should correctly convert the temperature raw value', () => {
      SensorDataConverter.convertRawData({temperature: 0}).temperature.should.equal(-46.85);
      SensorDataConverter.convertRawData({temperature: 1}).temperature.should.equal(-46.847318725585936);
      SensorDataConverter.convertRawData({temperature: 1023}).temperature.should.equal(-44.10705627441406);
      SensorDataConverter.convertRawData({temperature: 10000}).temperature.should.equal(-20.037255859375);
      SensorDataConverter.convertRawData({temperature: 55000}).temperature.should.equal(100.6200927734375);
      SensorDataConverter.convertRawData({temperature: 65535}).temperature.should.equal(128.86731872558593);
    });

    it('should correctly convert the temperature_alt raw value', () => {
      SensorDataConverter.convertRawData({temperature_alt: 0}).temperature_alt.should.equal(90.754);
      SensorDataConverter.convertRawData({temperature_alt: 1}).temperature_alt.should.equal(90.58543);
      SensorDataConverter.convertRawData({temperature_alt: 20}).temperature_alt.should.equal(87.4016);
      SensorDataConverter.convertRawData({temperature_alt: 500}).temperature_alt.should.equal(18.944000000000003);
      SensorDataConverter.convertRawData({temperature_alt: 1023}).temperature_alt.should.equal(-29.41780999999999);
    });

    it('should correctly convert the VOC raw value', () => {
      SensorDataConverter.convertRawData({voc: 13}).voc.should.equal(400);
      SensorDataConverter.convertRawData({voc: 20}).voc.should.equal(448.90829694323145);
      SensorDataConverter.convertRawData({voc: 242}).voc.should.equal(2000);
      SensorDataConverter.convertRawData({voc: 500}).voc.should.equal(3802.6200873362445);
      SensorDataConverter.convertRawData({voc: 1023}).voc.should.equal(7456.768558951965);
    });

    it('should return null for invalid VOC values', () => {
      should.strictEqual(SensorDataConverter.convertRawData({voc: 0}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 1}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 2}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 3}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 4}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 5}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 6}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 7}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 8}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 9}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 10}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 11}).voc, null);
      should.strictEqual(SensorDataConverter.convertRawData({voc: 12}).voc, null);
    });

  });

});
