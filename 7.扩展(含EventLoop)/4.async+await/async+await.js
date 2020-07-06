/*
* async + await 就是co + generator的语法糖
*
* async 函数返回的就是一个promise 可以 直接使用
* */

const fs = require('fs').promises;

async function read() {
    let content = await fs.readFile('./name.txt', 'utf8');
    let age = await fs.readFile(content.trim(), 'utf8');
    return age;
}

read().then(data=>{
    console.log(data);
}).catch(err=>{
    console.log(err);
});


// 如何实现一个async + await  看是否编译 async  =》 generator
