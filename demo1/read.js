let fs=require('fs');
// function  read(){
//      fs.readFile("poem.md",(err,value)=>{
//             if(err) throw err
//             console.log(value.toString());
//      })
// }
// read();
//promise
let p=new Promise((resolve,reject)=>{
   fs.readFile("poem1.md",(err,value)=>{
    if(err) reject("找不到文件")
    resolve(value)
   })

});
p.then(function(value){
    console.log(value.toString());
      

},function(err){

    console.log(err.toString());
})

