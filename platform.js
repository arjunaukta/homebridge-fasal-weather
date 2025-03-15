const axios = require('axios');
const {
  DynamicPlatformPlugin,
  PlatformAccessory,
  Service,
  Characteristic,
} = require('homebridge');

class FasalWeatherPlatform {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.accessories = [];

    if (!config.apiKey || !config.customerId || !config.plotId) {
      this.log.error('API key, customer ID, and plot ID must be set in config.json');
      return;
    }

    api.on('didFinishLaunching', () => {
      this.discoverDevices();
    });
  }

  async discoverDevices() {
    try {
      const url = `https://api.fasal.co/v1/customer/${this.config.customerId}/plot/${this.config.plotId}/data`;
      const response = await axios.get(url, {
        headers: {
          'x-api-key': this.config.apiKey,
        },
      });
      const data = response.data;
      
      this.registerAccessory('Temperature Sensor', Service.TemperatureSensor, Characteristic.CurrentTemperature, data.temprature.latestReading);
      this.registerAccessory('Humidity Sensor', Service.HumiditySensor, Characteristic.CurrentRelativeHumidity, data.humidity.latestReading);
      this.registerAccessory('Rainfall Sensor', Service.LeakSensor, Characteristic.LeakDetected, data.rainFall.lastHour > 0 ? 1 : 0);
      this.registerAccessory('Wind Speed Sensor', Service.Fan, Characteristic.RotationSpeed, data.windSpeed);
      this.registerAccessory('Soil Moisture Sensor', Service.HumiditySensor, Characteristic.CurrentRelativeHumidity, data.soilMoistureL1);
      this.registerAccessory('Soil Temperature Sensor', Service.TemperatureSensor, Characteristic.CurrentTemperature, data.soilTemprature);
      this.registerAccessory('Light Sensor', Service.LightSensor, Characteristic.CurrentAmbientLightLevel, data.lux.latestReading);
      this.registerAccessory('Pressure Sensor', Service.AirQualitySensor, Characteristic.AirQuality, data.pressure.latestReading);
      this.registerAccessory('Evapotranspiration Sensor', Service.Sensor, Characteristic.StatusActive, data.evapoTranspiration[0].value);
      this.registerAccessory('Delta T', Service.Sensor, Characteristic.StatusActive, data.deltaT[0].isSprayable ? 1 : 0);
      this.registerAccessory('VPD Sensor', Service.Sensor, Characteristic.StatusActive, data.vpd[0].value);
    } catch (error) {
      this.log.error('Failed to fetch weather data:', error);
    }
  }

  registerAccessory(name, serviceType, characteristicType, value) {
    const uuid = this.api.hap.uuid.generate(name);
    const existingAccessory = this.accessories.find(acc => acc.UUID === uuid);
    
    if (!existingAccessory) {
      const accessory = new this.api.platformAccessory(name, uuid);
      accessory.addService(serviceType, name)
        .getCharacteristic(characteristicType)
        .onGet(() => value);
      
      this.api.registerPlatformAccessories('homebridge-fasal-weather', 'FasalWeatherPlatform', [accessory]);
      this.accessories.push(accessory);
    }
  }
}

module.exports = { FasalWeatherPlatform };
