
import axios from 'axios'
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.1/css/bootstrap.css' },
      { rel:"stylesheet", href:"https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"}
    ],
    script: [
      { src: 'https://code.jquery.com/jquery-3.3.1.slim.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js' },
      { src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js' }
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/styles/_carbon.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/fireauth.js',
    {src: '~/plugins/user-logged.js', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  generate: {
    fallback: true
  },

  router: {
    // extendRoutes (routes, resolve) {
    //   routes.push({
    //     path: '*',
    //     redirect : 'user'
    //   },
    //   {
    //     path: '/',
    //     redirect : 'user'
    //   })
    // }
  },


  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/svg',
    'bootstrap-vue/nuxt',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyBvY08wKUp9DMQJ4y9s_tpioux-1gDMivE',
          authDomain: '<authDomain>',
          databaseURL: 'https://bisca-online.firebaseio.com/',
          projectId: 'bisca-online',
          storageBucket: '<storageBucket>',
          messagingSenderId: '<messagingSenderId>',
          appId: '1:627553851962:web:63dffbd4ed826e11333303',
          measurementId: '<measurementId>'
        },
        services: {
          realtimeDb: true,
          functions: true,
          // auth: {
          //   initialize: {
          //     // onAuthStateChangedAction: 'onAuthStateChanged'
          //     onAuthStateChangedMutation: 'SET_AUTH_USER',
          //     persistence: 'local',
          //     ssr: false
          //   }
          // },
        }
      }
    ]
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
