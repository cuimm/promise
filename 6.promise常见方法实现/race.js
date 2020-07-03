function isPromise(value) {
    if ((value !== null && typeof value === 'object') || typeof value === 'function') {
        return typeof value.then === 'function';
    }
    return false;
}

/*
* Promise.race 内部实现
* 多个promise，哪个先执行完就返回哪个的执行结果
* */
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            const value = promises[i];
            if (isPromise(value)) {
                value.then(y => {
                    resolve(y);
                }, reject);
            } else {
                resolve(value);
            }
        }
    });
};


/********** EXAMPLE  **********/
const fs = require('fs');

function readFile(filename, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, encoding, (error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
}

const promise1 = readFile('./assets/name.txt', 'utf-8');
const promise2 = readFile('./assets/age.txt', 'utf-8');
Promise.race([promise1, promise2]).then(res => {
    console.log(res);
});


/********** 应用场景  **********/
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功');
    }, 3000);
})

function wrap(p) {
    let abort;
    let p1 = new Promise((resolve, reject) => {
        abort = reject;
    });
    let newPromise = Promise.race([p1, p])
    newPromise.abort = abort
    return newPromise
}

let p1 = wrap(p);
p1.then(data => {
    console.log('success', data)
}, err => {
    console.log('error', err)
})
setTimeout(() => {
    p1.abort('超过2s了');
}, 2000);
