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
