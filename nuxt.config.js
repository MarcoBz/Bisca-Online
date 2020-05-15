
import axios from 'axios'
import dotenv from "dotenv";
dotenv.config();

export default {

  env: {
    API_KEY : process.env.API_KEY,
    AUTH_DOMAIN : process.env.AUTH_DOMAIN,
    DATABASE_URL : process.env.DATABASE_URL,
    PROJECT_ID :  process.env.PROJECT_ID,
    STORAGE_BUCKET : process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID : process.env.MESSAGING_SENDER_ID,
    APP_ID : process.env.APP_ID,
    MEASURAMENT_ID : process.env.MEASURAMENT_ID,
  },

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
    extendRoutes (routes, resolve) {
      routes.push({
        path: '*',
        redirect : '/v1/user'
      },
      {
        path: '/',
        redirect : '/v1/user'
      })
    }
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
        config : {
          apiKey: process.env.API_KEY,
          authDomain: process.env.AUTH_DOMAIN,
          databaseURL: process.env.DATABASE_URL,
          projectId: process.env.PROJECT_ID,
          storageBucket: process.env.STORAGE_BUCKET,
          messagingSenderId: process.env.MESSAGING_SENDER_ID,
          appId: process.env.APP_ID,
          measurementId: process.env.MEASURAMENT_ID
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
