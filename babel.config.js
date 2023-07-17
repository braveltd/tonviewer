module.exports = {
  presets: ['next/babel'],
  plugins: [
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-class-properties',
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          'tonviewer-web': './src'
        }
      }
    ],
    [
      'inline-react-svg',
      {
        svgo: false
      }
    ]
  ]
};
