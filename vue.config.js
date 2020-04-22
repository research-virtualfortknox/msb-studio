module.exports = {
  chainWebpack: config => {
    config
      .plugin('define')
      .tap(args => {
        let v = JSON.stringify(require('./package.json').version)
        args[0]['process.env']['APP_VERSION'] = v
        return args
      })
  }
}
