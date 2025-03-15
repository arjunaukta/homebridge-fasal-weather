const { FasalWeatherAccessory } = require('./accessory');

class FasalWeatherPlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.accessories = [];

        if (!config || !config.apiKey || !config.customerId || !config.plotId) {
            this.log.error('Missing required config values (apiKey, customerId, plotId)');
            return;
        }

        this.api.on('didFinishLaunching', () => {
            this.log('FasalWeatherPlatform finished launching');
            this.addAccessory();
        });
    }

    addAccessory() {
        const uuid = this.api.hap.uuid.generate(this.config.plotId);
        const accessory = new this.api.platformAccessory('Fasal Weather Station', uuid);

        new FasalWeatherAccessory(this.log, this.config, accessory, this.api);

        this.api.registerPlatformAccessories('homebridge-fasal-weather', 'FasalWeatherPlatform', [accessory]);
        this.accessories.push(accessory);
    }
}

module.exports = { FasalWeatherPlatform };