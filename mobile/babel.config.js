module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          components: "./src/components",
          buttons: "./src/components/buttons",
        },
      },
    ],
  ],
};
