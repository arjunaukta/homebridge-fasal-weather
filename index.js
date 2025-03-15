const { FasalWeatherPlatform } = require('./src/platform');

module.exports = (homebridge) => {
    homebridge.registerPlatform('homebridge-fasal-weather', 'FasalWeatherPlatform', FasalWeatherPlatform);
};