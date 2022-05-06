const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    /*publicPath: '',
    configureWebpack: {
        externals: {
            vue: 'Vue',
            vuex: 'Vuex',
            jQuery: 'jQuery',
            AmetysFront: 'AmetysFront',
            AmetysUtils: 'AmetysUtils',
            vuetify: 'Vuetify',
            Velocity: 'Velocity'
        }
    },*/
    publicPath: '',
    transpileDependencies: [
      'vuetify'
    ]
})
