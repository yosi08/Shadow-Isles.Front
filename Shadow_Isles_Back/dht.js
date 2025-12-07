// sensors/dht.js
const sensor = require('node-dht-sensor');

module.exports.readDHT = () =>
  new Promise((resolve, reject) => {
    const DHT_TYPE = 22; // DHT22 = 22, DHT11 = 11
    const GPIO_PIN = 4;  // GPIO4 (BCM)

    sensor.read(DHT_TYPE, GPIO_PIN, (err, temperature, humidity) => {
      if (err) return reject(err);

      resolve({
        temperature: parseFloat(temperature.toFixed(1))
        
      });
    });
  });