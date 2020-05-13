module.exports = {
  chainWebpack: config => {
    config
      .plugin('define')
      .tap(args => {
        let v = JSON.stringify(require('./package.json').version)
        args[0]['process.env']['APP_VERSION'] = v
        return args
      })

    if (process.env.NODE_ENV === 'test') {
      const sassRule = config.module.rule('sass')
      sassRule.uses.clear()
      sassRule.use('null-loader').loader('null-loader')
    }
  }
}
