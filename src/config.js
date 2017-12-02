const fs = require('fs-extra');

const config = {};

Object.assign(config, JSON.parse(fs.readFileSync('config.json')));

module.exports = config;
