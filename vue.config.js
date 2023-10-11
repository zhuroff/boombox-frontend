const path = require('path')

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src')
      },
      extensions: ['.ts', '.vue', '.scss']
    },
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
}
