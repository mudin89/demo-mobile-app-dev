const path = require("path"); // 👈 Add this line
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // 👈 maps @ to src/
        },
        resolverMainFields: ['react-native', 'browser', 'main'],
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
