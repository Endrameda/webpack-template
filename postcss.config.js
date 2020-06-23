module.exports = {
    plugins: {
        'autoprefixer': {},
        '@lipemat/css-mqpacker': {},
        'postcss-pxtorem': {
            rootValue: 16,
            propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
            selectorBlackList: [],
            mediaQuery: false,
            exclude: /node_modules/i
        }
    }
}