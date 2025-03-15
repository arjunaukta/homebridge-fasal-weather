
// homebridge-fasal-weather/src/index.js

const { API } = require('homebridge');
const { FasalWeatherPlatform } = require('./platform');

module.exports = (api) => {
  api.registerPlatform('FasalWeatherPlatform', FasalWeatherPlatform);
};
