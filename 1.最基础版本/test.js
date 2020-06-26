const Promise = require('./promise');

let p = new Promise((resolve, reject) => {
  // 1、成功
  // resolve('success');

  // 2、失败
  // reject('failed');

  // 3、抛出异常
  // throw new Error('抛出异常');

  // 4、异步
  setTimeout(() => {
    // resolve('异步success');
    reject('异步failed');
  });
});

p.then(res => {
  console.log('成功', res);
}, error => {
  console.log('失败', error);
});
