let config = {
  presets: ["@babel/preset-env"],
  plugins: []
};
module.exports = function(api) {
  api.cache(true);
  const presets = config.presets;
  const plugins = config.plugins;
  return {
    presets,
    plugins
  };
};
