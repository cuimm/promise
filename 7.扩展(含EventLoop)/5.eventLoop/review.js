console.log(1);
async function async () {
    console.log(2);
    await console.log(3); // Promise.resolve(console.log(3)).then(()=>{4})
    console.log(4)
}
setTimeout(() => {
    console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
    console.log(res)
})
async();
console.log(8);

/*
* 1、代码从上到下执行，首先打印出1
* 2、第2行：定义async函数
* 3、第7行：将setTime加入宏任务队列，此时宏任务队列：[5]
* 4、第10行：创建一个promise实例，promise里面的回调函数立马执行，输出6，此时宏任务队列：[5]
* 5、第14行：promise的then方法是异步的，将该方法放入微任务队列，此时：此时宏任务队列：[5]，微任务队列：[7]
* 6、第17行：执行async方法，输出2，await后的代码相当于是：Promise.resolve(console.log(3)).then(()=>{4})，resolve里面是立马执行的，输出3，然后将then的回调加入微任务队列，
*    此时：此时宏任务队列：[5]，微任务队列：[7, 4]
* 7、第18行：输出8
* 8、此时主线程的宏任务执行完毕，然后回去清空微任务队列，输出7、4，此时：此时宏任务队列：[5]，微任务队列：[]
* 9、拿出一个宏任务执行，输出5
* */

//*** 打印输出结果
// 1
// 6
// 2
// 3
// 8
// 7
// 4
// 5


console.log('2.****************************************');

console.log(1);
async function async () {
    console.log(2);
    await console.log(3); // Promise.resolve(console.log(3)).then(()=>{4})
    console.log(4)
}
setTimeout(() => {
    console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
    console.log(res)
})
async();
console.log(8);


/*
* 1、代码从上到下执行，首先打印出1
* 2、第2行：定义async函数
* 3、第7行：将setTime加入宏任务队列，此时宏任务队列：[5]
* 4、第10行：创建一个promise实例，promise里面的回调函数立马执行，输出6，此时宏任务队列：[5]
* 5、第14行：promise的then方法是异步的，将该方法放入微任务队列，此时：此时宏任务队列：[5]，微任务队列：[7]
* 6、第17行：执行async方法，输出2，await后的代码相当于是：Promise.resolve(console.log(3)).then(()=>{4})，resolve里面是立马执行的，输出3，然后将then的回调加入微任务队列，
*    此时：此时宏任务队列：[5]，微任务队列：[7, 4]
* 7、第18行：输出8
* 8、此时主线程的宏任务执行完毕，然后回去清空微任务队列，输出7、4，此时：此时宏任务队列：[5]，微任务队列：[]
* 9、拿出一个宏任务执行，输出5
* */

//*** 打印输出结果
// 1
// 6
// 2
// 3
// 8
// 7
// 4
// 5


console.log('3.****************************************');

setTimeout(() => {
    console.log('内层宏事件3')
}, 0);
console.log('外层宏事件1');

new Promise((resolve) => {
    console.log('外层宏事件2');
    resolve()
}).then(() => {
    console.log('微事件1');
}).then(()=>{
    console.log('微事件2')
})

// 输出：
// 外层宏事件1、外层宏事件2、微事件1、微事件2、内层宏事件3


console.log('4.****************************************');


const promise = new Promise(resolve => {
    setTimeout(() => {
        resolve('success')
        console.log('setTimeout')
    }, 0);
    console.log('promise');
}).then(res => {
    console.log(res);
});
console.log('main')

// 输出
// promise
// main
// setTimeout
// success


console.log('5.****************************************');

Promise.resolve()
    .then(() => { // then1
        console.log(1);
        Promise.resolve().then(() => { // then11
            console.log(11);
        }).then(() => {
            console.log(22); // then22
        }).then(() => {
            console.log(33); // then33
        })
    })
    .then(() => { // then2
        console.log(2);
    })
    .then(() => { // then3
        console.log(3);
    });
// 1 11 2 22 3 33
// [,then3,then33]

// 分析：
// 微任务的执行顺序：先入队列先执行，promise成功之后，才会将then的回调放入微任务队列
// Promise.resolve() 成功后将then1加入微任务队列 [then1] 打印1
// 代码往下执行，再将then11加入队列，[then1, then11] 打印11
// 此时then1返回了undedined，将then2加入队列，[then1, then11, then2]，打印2
// ...


// 注：Promise的executor是一个同步函数，即非异步，立即执行的一个函数，因此他应该是和当前的任务一起执行的。而Promise的链式调用then，每次都会在内部生成一个新的Promise，然后执行then，在执行的过程中不断向微任务(microtask)推入新的函数，因此直至微任务(microtask)的队列清空后才会执行下一波的macrotask。

// 如果then11那一行添加return的话，输出：1、11、22、33、2、3

// 1 11 2 22 3 33




console.log('6.****************************************');

async function async1() { // node 11 结果不太一样
    console.log('async1 start');
    // node的其他版本可能会把await 解析出两个then 来
    await async2(); // Promise.resolve(async2()).then(()=>{console.log('ok')})
    console.log('ok');
}

async function async2() {
    console.log('async2');
}

console.log('script start');
setTimeout(() => {
    console.log('setTimeout')
}, 0);
async1();
new Promise(function (resolve) {
    console.log('promise1');
    resolve()
}).then(function () {
    console.log('script end')
})


// 输出：script start、async1 start、async2、promise1、ok、script end、setTimeout
