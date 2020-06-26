const fs = require('fs');

function isPromise(promise) {
  if ((promise !== null && typeof promise === 'object') || typeof promise === 'function') {
    return typeof promise.then === 'function';
  }
  return false;
}
/*
* all 内部实现
* */
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    const arr = [];
    // 计数器：防止由于后面的先执行完成的时候:arr[i]=xxx arr的长度就已经和和传入参数长度相同
    let index = 0;
    function processValue(i, value) {
      arr[i] = value;
      if (++index === promises.length) {
        resolve(arr);
      }
    }
    for (let i = 0; i <= promises.length - 1; i++) {
      const value = promises[i];
      if (isPromise(value)) {
        value.then(y => {
          processValue(i, y);
        }, reject);
      } else {
        processValue(i, value);
      }
    }
  });
};


/********** EXAMPLE  **********/
function readFile(fileName, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, encoding, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
}

const promise1 = readFile('./assets/name.txt', 'utf-8');
const promise2 = readFile('./assets/age.txt', 'utf-8');


Promise.all([promise1, promise2, 123]).then(res => {
  console.log(res);
});
