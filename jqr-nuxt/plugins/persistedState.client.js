// 在这个自定义插件中配置 vuex-persistedstate
import createPersistedState from 'vuex-persistedstate'

// 这里什么都可以写, 不过如果你需要用到 nuxt 本身, 必须通过 export 的方式暴露函数来接收

export default ({store}) => {
    createPersistedState({
        key: 'jqrjr',
      })(store)
}
