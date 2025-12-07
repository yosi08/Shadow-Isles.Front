// sensors/light.js
const BH1750 = require('bh1750-sensor');

const sensor = new BH1750();

module.exports.readLight = async () => {
  const lux = await sensor.readLight();
  return { light: Math.round(lux) };
};