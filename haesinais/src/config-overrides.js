const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = function override(config) {
  config.plugins.push(
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    })
  );
  return config;
};