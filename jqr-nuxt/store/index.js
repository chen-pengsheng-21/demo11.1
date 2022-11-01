
export const state = () => ({
    userinfo: undefined,
    student: undefined,//绑定学生成功后登录保存学生信息
    teacher:undefined,//绑定教师成功后登录保存教师信息
    token: undefined,
    menus:[],
   // binding: false, //绑定用户，学生，教师，教辅
    school: {
        id: 1,
        schoolName: '泉州信息工程学院',
        province: "福建省",
        city: '泉州市',
        area: '丰泽区',
        latitude: '24.942463',
        longitude: '118.583885'

    },
    articleCats:[],
    markdownOption: {
        language: "zh-CN",
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        // superscript: true, // 上角标
        // subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        navigation: false, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true, // 单双栏模式
        preview: false, // 预览
    },
    excludeUrls: ['/', '/login', '/register','/static/competition','/static/interview'],
    imageTypes: ['image/jpeg', 'image/x-png', 'image/png', 'image/gif', 'image/jpg', 'image/bmp']

})

export const mutations = {

    setUserinfo(state, userinfo) {
        state.userinfo = userinfo
    },
    setToken(state, token) {
        state.token = token
    },
    setStudent(state,student){
        state.student=student;
    },
    setTeacher(state,teacher){
        state.teacher=teacher;
    },
    setMenus(state, menus) {
       if(!menus){
        state.menus=state.defaultMenus;
       } 
       else{
        state.menus=menus;
       }
        
    },
    setSchool(state, school) {
        state.school = school;

    }


}
export const getters = {
    userinfo(state) {
        return state.userinfo;
    },
    token: (state) => state.token,
    menus(state) {
        return state.menus;
    }

}

export const actions = {
    //store  状态信息
    //context 上下文
    // nuxtServerInit(store, context) {
    //     store.commit('setToken','abcdesfgh');
    //     //console.log(store, 'nuxtServerInit');
    // }
}


