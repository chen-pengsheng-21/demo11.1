/**
 * 根据指定路由查找路由数组判读是否存在
 * @param {*} router 路由路径
 * @param {*} routerArray 路由路径数组
 * @returns true 包含 false不包含
 */
function findArrayIsSame(router, routerArray) {
    /**
     * 第一种算法find
     */
    // let path = routerArray.find((item) => {
    //     return item == router  //找到返回第一个匹配的成员，否则undefined
    // })
    // if (path) {
    //     return true;
    // }
    // return false;
    // let routerString = routerArray.join('');
    /**
     * 第二种算法includes
     */
     return routerArray.includes(router);

     /**
     * 第三种算法findIndex
     */
}
export { findArrayIsSame }