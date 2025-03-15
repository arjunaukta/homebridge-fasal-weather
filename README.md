# Homebridge Fasal Weather

A Homebridge plugin to fetch weather data from the Fasal Weather Station API and expose it to HomeKit.

## Installation

1. Install [Homebridge](https://github.com/homebridge/homebridge).
2. Install this plugin:

   ```sh
   npm install -g homebridge-fasal-weather
   ```

3. Configure `config.json` in Homebridge UI:

   ```json
   {
     "platform": "FasalWeatherPlatform",
     "apiKey": "your-api-key",
     "customerId": "your-customer-id",
     "plotId": "your-plot-id"
   }
   ```

4. Restart Homebridge and check logs for sensor updates.
