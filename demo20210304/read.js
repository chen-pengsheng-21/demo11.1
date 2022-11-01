let fs=require('fs'); //引入nodejs模块
// fs.readFile("poem.md",(err,value)=>{
//     if(err) throw err
//     console.log(value.toString())
// })


//promise 进行重新改装

let p=new Promise((resolve,reject)=>{
    fs.readFile("poem.md",(err,value)=>{
            if(err) reject("文件找不到")
            resolve(value)
        })
})
p.then(value=>{
    console.log(value.toString())
    //回调地狱
    //一个依赖于另一个
    //嵌套下去
},err=>{

    console.log(err.toString())
})

