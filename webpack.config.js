const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.devServer = config.devServer ?? {};
  config.devServer.proxy = {
    ...config.devServer.proxy,
    '/auth': {
      target: 'http://localhost:8001',
      changeOrigin: true,
    },
  };

  return config;
};
