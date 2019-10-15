module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    externals: {
      stripe: 'Stripe'
    }
  },
  runtimeCompiler: true
}