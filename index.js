const { API } = require('homebridge');
const { FasalWeatherPlatform } = require('./platform');

module.exports = (api) => {
  api.registerPlatform('homebridge-fasal-weather', FasalWeatherPlatform);
};
