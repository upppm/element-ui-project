const progPlugins = []
if (process.env.NODE_ENV === "production") {
  progPlugins.push("transform-remove-console")
}
module.exports = {
  // 拿到项目发布阶段的特有属性内容进行判断
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // 这个插件在开发和发布阶段都会移除consle.log,在发布阶段移除，进行打包
    // ...progPlugins
  ]
}
