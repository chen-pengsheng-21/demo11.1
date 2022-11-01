//插件
//路由守卫
export default ({app})=>{
    app.router.beforeEach((to,from,next)=>{
       // console.log(to,from);
        next();
    })
}