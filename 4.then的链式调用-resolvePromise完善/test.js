const Promise = require('./promise');

let p1 = new Promise((resolve, reject) => {
  // resolve('success');
  reject('fail');
});

// then的链式调用
// onFulfilled, onRejected 这2个参数是非必须的
p1.then().then().then(res => {
  console.log(res);
}, err => {
  console.log(err);
});

// new Promise的时候，value有可能是一个promise
let p2 = new Promise((resolve, reject) => {
  resolve(new Promise((r, j) => {
    setTimeout(() => {
      r('value是一个promise');
    }, 100);
  }));
});

p2.then(res => {
  console.log('res', res);
}, err => {
  console.log('error', err);
});
