/**
 * axios 工具
 */
import axios from 'axios'
let instance=axios.create({
    //config
    //baseURL:'http://127.0.0.1:7001/',
    baseURL:'http://api.qzimp.cn/',
    timeout:5000,
})
//-------------拦截器---------------------
//----------------request----------------------
instance.interceptors.request.use(
    function(config){
        
        return config;
    },
    function(err){
        return new Promise.reject(err);
    }
);
//-------------respones---------------
instance.interceptors.response.use(
    function(response){
        return response.data;
    },
    function(err){
        return new Promise.reject(err);
    }
);

//--------------------------------
//对axios一些方法进行封装
/**
 * 远程通信get请求 
 * 返回json对象
 * @param {*} url 请求地址 baseUrl+url
 * @param {*} param {} json对象
 */
async function get(url,params){

    return instance.get(url,{params});
}
async function getNoParam(url){
    return instance.get(url)
}
/**
 * 远程通信post请求 
 * 返回json对象
 * @param {*} url 请求地址 baseUrl+url
 * @param {*} data  {}json
 */
async function post(url,data){
    //返回Promise对象
    return instance.post(url,data)
}
export {get,getNoParam,post}
