let config = {
  "presets": ["@babel/preset-env"],
}
module.exports = function (api) {
  api.cache(true);
  const presets = config.presets;
  const plugins = config.plugins;
  return {
    ignore: [],
    presets,
    plugins
  };
}
