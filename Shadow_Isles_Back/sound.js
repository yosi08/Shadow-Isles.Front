// sensors/sound.js
const mcpadc = require('mcp-spi-adc');

// MCP3008의 CH0 사용
const soundSensor = mcpadc.open(0, { speedHz: 20000 }, (err) => {
  if (err) console.error("Failed to initialize MCP3008", err);
});

module.exports.readSound = () =>
  new Promise((resolve) => {
    soundSensor.read((err, reading) => {
      if (err) return resolve({ sound: 0 });

      // reading.value는 0.0 ~ 1.0
      const soundValue = Math.round(reading.value * 100); // 0~100으로 변환

      resolve({ sound: soundValue });
    });
  });