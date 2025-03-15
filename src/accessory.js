const axios = require('axios');

class FasalWeatherAccessory {
    constructor(log, config, accessory, api) {
        this.log = log;
        this.config = config;
        this.accessory = accessory;
        this.api = api;

        this.service = this.accessory.getService(api.hap.Service.TemperatureSensor)
            || this.accessory.addService(api.hap.Service.TemperatureSensor);
        
        this.humidityService = this.accessory.getService(api.hap.Service.HumiditySensor)
            || this.accessory.addService(api.hap.Service.HumiditySensor);

        this.rainService = this.accessory.getService(api.hap.Service.LeakSensor)
            || this.accessory.addService(api.hap.Service.LeakSensor);

        this.windService = this.accessory.getService(api.hap.Service.Fan)
            || this.accessory.addService(api.hap.Service.Fan);

        this.updateWeatherData();
        setInterval(() => this.updateWeatherData(), 300000);
    }

    async updateWeatherData() {
        const url = `https://api.fasal.co/v1/customer/${this.config.customerId}/plot/${this.config.plotId}/data`;

        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
            });
            const data = response.data;

            this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentTemperature, data.temperature.latestReading);
            this.humidityService.updateCharacteristic(this.api.hap.Characteristic.CurrentRelativeHumidity, data.humidity.latestReading);
            this.rainService.updateCharacteristic(this.api.hap.Characteristic.LeakDetected, data.rainFall.lastHour > 0);
            this.windService.updateCharacteristic(this.api.hap.Characteristic.RotationSpeed, data.windSpeed);
        } catch (error) {
            this.log.error('Error fetching data from Fasal:', error.message);
        }
    }
}

module.exports = { FasalWeatherAccessory };