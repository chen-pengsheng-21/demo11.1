export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '微校园',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/bitbug_favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/static/index.css',
    "quill/dist/quill.snow.css",
    "quill/dist/quill.bubble.css",
    "quill/dist/quill.core.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/guard',
    '@/plugins/axios',
    '@/plugins/persistedState.client.js',
    { src: '@/plugins/vue-mavon-editor.js', ssr: false },
    { src: '@/plugins/vue-monoplasty-slide-verify.js', ssr: false },
    '@/plugins/loadsh.js',
    { src: "@/plugins/vue-quill-editor.js", ssr: false }, 

    
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  //自动导入组件
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    //'@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    //'cookie-universal-nuxt',
    '@nuxtjs/proxy',
    '@nuxtjs/markdownit',
    ['nuxt-clipboard', { autoSetContainer: true }]

    // '@nuxtjs/dayjs'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    proxy:false,//是否进行跨域
    //credentials:true,
    //baseURL:'http://localhost:8081/'
    baseURL:'http://api.jqrjq.cn'
  },
  proxy:{
    // '/api':{
    //   target:'http://localhost:8081/',
    //   pathRewrite:{
    //     '/^api':''
    //   }
    // },
    //'/api/':'http://api.jqrjq.cn'
    // '/api/':'http://localhost:8081'
   },
   markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    runtime: true,
    use: [
      'markdown-it-div',
      'markdown-it-attrs',
      
    ]
  },


  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/]
  },
  router:{
    middleware:['init','auth']
  },   
 
}
