const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PROJECTS = (process.env.PROJECTS || '').split(',');
const IS_WATCH = !!process.env.WATCH;

const resolveConfig = {
  symlinks: false,
  extensions: ['.js', '.json', '.ts', '.tsx'],
};

const includeDirs = ['src'].map((x) => path.resolve(__dirname, x));

const moduleConfig = (tscOptions = {}) => ({
  rules: [
    {
      test: /\.(ts|tsx)$/,
      include: includeDirs,
      use: [
        {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              ...tscOptions,
            },
          },
        },
      ],
    },
    {
      test: /\.css$/i,
      use: [
        MiniCssExtractPlugin.loader,
        // TODO: autoprefixer/postcss plugin 
        'css-loader'
      ],
    },
  ],
});

/**
 * Lets server side webpack bundles use sourcemaps
 * See: https://decembersoft.com/posts/how-to-fix-your-server-side-typescript-call-stack-with-webpack-bannerplugin/
 */
const sourceMapBannerPlugin = new webpack.BannerPlugin({
  banner: 'require("source-map-support").install();',
  raw: true,
  entryOnly: false,
});

const htmlPlugin = new HtmlWebpackPlugin({
  template: './src/frontend/index.html',
});

const cssPlugin = new MiniCssExtractPlugin({
  filename: 'bundle.css',
});

const frontendBuild = (name, entryFile, outputFile) => ({
  name: name,
  entry: entryFile,
  output: {
    path: __dirname + '/dist/www',
    filename: outputFile,
  },
  module: moduleConfig({ target: 'ES6', module: 'ES6' }),
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  resolve: resolveConfig,
  watch: IS_WATCH,
  devServer: {
    historyApiFallback: true, // replace 404 page with index.html for client-side routing
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
      },
    },
  },
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows to avoid bundling all of your
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [htmlPlugin, cssPlugin],
});

const backendBuild = (name, entryFile, outputFile = 'server.js') => {
  return {
    name: name,
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    entry: entryFile,
    output: {
      path: __dirname + '/dist',
      filename: outputFile,
      pathinfo: true,
    },
    watch: IS_WATCH,
    module: moduleConfig({ target: 'ES2017', module: 'ES6' }),
    mode: 'development',
    devtool: 'source-map',
    resolve: resolveConfig,
    // ignores node_modules
    externals: [nodeExternals()],
    plugins: [sourceMapBannerPlugin],
  };
};

const availableProjects = {
  frontend: frontendBuild('frontend', './src/frontend/main.tsx', 'bundle.js'),

  backend: backendBuild('backend', './src/backend/main.ts', 'server.js'),

  test: backendBuild('test', './src/test.ts', 'test.js'),
};

module.exports = PROJECTS.map((p) => availableProjects[p]);
