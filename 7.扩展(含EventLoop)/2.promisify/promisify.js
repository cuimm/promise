/*
* promisify 把一个node中的api 转换成promise的写法
* */

const fs = require('fs');
const util = require('util');

// node的api，回调函数的第一个参数是error，第二个参数是data
fs.readFile('../../.npmrc', 'utf-8', (err, data) => {
    if (err) {
        return;
    }
    console.log(data);
});

// util内部promisify方法可以将node的api转成promise的写法
let read = util.promisify(fs.readFile);

read('../../.npmrc', 'utf-8').then(res => {
    console.log(res);
}).catch(error => {
    console.log(error);
});

/*
* 自定义 promisify 方法
* */
const promisify = function (fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (error, data) => {
                if (error) reject(error);
                resolve(data);
            });
        });
    }
};

/*
* 将方法库内部的方法全都增加一个Async后缀的方法
* */
const promisifyAll = function (target) {
    Reflect.ownKeys(target).forEach(key => {
        target[`${key}Async`] = promisify(target[key]);
    });
    return target;
};

// 将 fs.readFile 转成promise
read = promisify(fs.readFile);
read('../../.npmrc', 'utf-8')
    .then(res => {
        console.log('res', res);
    })
    .catch(error => {
        console.log('error', error);
    });

// 将fs内部的api都增加一个Async后缀的方法
const fsAsync = promisifyAll(fs);
fsAsync.readFileAsync('../../.npmrc', 'utf-8')
    .then(res => {
        console.log('resAsync', res);
    })
    .catch(error => {
        console.log('errorAsync', error);
    });
