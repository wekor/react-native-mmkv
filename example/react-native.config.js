const path = require('path');
const pkg = require('../package.json');
const library = require('../react-native.config.js');

module.exports = {
  dependencies: {
    [pkg.name]: {
      root: path.join(__dirname, '..'),
      // Spelled out so the C++ TurboModule's CMake fields reach autolinking.
      platforms: library.dependency.platforms,
    },
  },
};
