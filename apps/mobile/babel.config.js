module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@pathr/ui': '../../packages/ui/src',
            '@pathr/shared': '../../packages/shared/src',
          },
        },
      ],
    ],
  };
};


