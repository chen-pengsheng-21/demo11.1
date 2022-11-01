import axios from 'axios'
// import LRU from 'lru-cache'
// const options = {
//   max: 100, // 缓存队列长度
//   ttl: 1000 * 60,// 缓存时间,
//   maxEntrySize:100
// }
// const CACHE = new LRU(options)
// import {
//   Message,
// } from 'element-ui';
export default ({ $axios, app }) => {
  //axios request拦截器
  /*
  axios实例没有all这个方法，all是axios的静态方法，静态方法和私有方法是不会被继承的
  在axios实例那里手动挂载这这个个方法
  手动挂载2个方法
  */
  $axios.all = axios.all;
  $axios.spread = axios.spread;


  $axios.onRequest((config) => {
    if (config.method == 'get') {
      config.headers['Content-Type'] = "application/x-www-form-urlencoded";
    }
    let token = app.store.state.token;
    if (token) {
      config.headers.token = token;//token验证
    }

  })
  // axios error
  $axios.onRequest((error) => {
    //   Message({
    //     showClose: true,
    //     message: error,
    //     type: 'error'
    // });
    //console.log(error)
  })
  $axios.onResponse(res => {
    // let result = null;
    // let key = res.config.baseURL + res.config.url;
    // if (CACHE.has(key)) {
    //   let data = CACHE.get(key);
    //   result = JSON.parse(data);
      
    // }
    // else {
    //   console.log(key)
    //   CACHE.set(key, JSON.stringify(res.data))
    //   result = res.data
    // }
    
    return res.data;
  })
}