export default function ({ store, route, redirect, params, query, req, res, app ,error}) {
    // console.log(store.commit('getToken'));
    // store.commit('getToken')//
    if(process.client){
        let token=store.state.token;
    let excludeUrls = store.state.excludeUrls;
    if (excludeUrls.includes(route.path)) {
        return true;
    }
    else {
           //判断哪些路径拦截
        if (!token) {
            redirect('/login')
        }
        else{
            return true
        }
        
    }
    }
    else{
        return true;
    }
   

}