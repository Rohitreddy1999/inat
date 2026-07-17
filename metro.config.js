const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const config = getDefaultConfig(__dirname)

// react-native-svg 15.12.x has a Metro path resolution bug on Windows
// where internal TS source imports fail. Force Metro to use the compiled
// CommonJS output instead of the TypeScript source (react-native field).
const originalResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-svg') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'node_modules/react-native-svg/lib/commonjs/index.js'),
    }
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform)
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = withNativeWind(config, { input: './global.css' })
