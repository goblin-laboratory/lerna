/* eslint-disable */
const {
  override,
  fixBabelImports,
  addLessLoader,
  // addBundleVisualizer,
} = require('customize-cra');
const paths = require('react-scripts/config/paths');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

// paths.servedPath = './';

const removePlugin = (plugins, name) => {
  const list = plugins.filter(it => !(it.constructor && it.constructor.name && name === it.constructor.name));
  if (list.length === plugins.length) {
    throw new Error(`Can not found plugin: ${name}.`);
  }
  return list;
};

const overrideGenerateSWConfig = (config, env) => {
  if ('development' === env) {
    return config;
  }
  config.plugins = removePlugin(config.plugins, 'GenerateSW');
  const workboxWebpackPlugin = new WorkboxWebpackPlugin.GenerateSW({
    clientsClaim: true,
    exclude: [/\.map$/, /asset-manifest\.json$/],
    importWorkboxFrom: 'local',
    // navigateFallback: paths.servedPath + '/index.html',
    // navigateFallbackBlacklist: [
    //   // Exclude URLs starting with /_, as they're likely an API call
    //   new RegExp('^/_'),
    //   // Exclude URLs containing a dot, as they're likely a resource in
    //   // public/ and not a SPA route
    //   new RegExp('/[^/]+\\.[^/]+$'),
    // ],
  });
  config.plugins.push(workboxWebpackPlugin);
  return config;
};

module.exports = {
  webpack: override(
    overrideGenerateSWConfig,
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    // fixBabelImports('ant-design-pro', {
    //   libraryName: 'ant-design-pro',
    //   libraryDirectory: 'lib',
    //   style: true,
    //   camel2DashComponentName: false,
    // }),
    addLessLoader({
      lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
        javascriptEnabled: true,
        // modifyVars: { '@primary-color': '#1DA57A' },
      },
    }),
    // addBundleVisualizer(),
  ),
  // devServer: configFunction => {
  //   return (proxy, allowedHost) => {
  //     const config = configFunction(proxy, allowedHost);
  //     config.historyApiFallback.rewrites = [{ from: /^\/login\.html/, to: '/build/login.html' }];
  //     return config;
  //   };
  // },
};
