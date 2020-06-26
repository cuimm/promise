const Promise = require('./promise');

let p1 = new Promise((resolve, reject) => {
  // 1、成功
  resolve('success');

  // 2、失败
  // reject('failed');

  // 3、抛出异常
  // throw new Error('抛出异常');

  // 4、异步
  setTimeout(() => {
    // resolve('异步success');
    // reject('异步failed');
  });
});

let p2 = p1.then(res => {
  console.log('p1成功', res);
  // 1、x是一个普通值类型：
  // return 123;

  // 2、x是一个对象
  // return { name: 'cuimm' };

  // 3、抛出异常
  // throw new Error('error...')

  // 4、成功回调返回的promise和then返回的promise是同一个：
  // return p2; // 自己等待自己 => 直接抛出错误：TypeError: Chaining cycle detected for promise #<Promise>

  // 5、返回一个promise：
  // return new Promise((resolve, reject) => {
  //   resolve('p1 返回成功的promise');
  //   // reject('p1 返回失败的promise');
  // });

  // 6、返回的promise中
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Promise((r, j) => {
        r('嵌套的promise');
      }));
    });
  });
}, error => {
  console.log('p1失败', error);
});


p2.then(res => {
  console.log('p2成功', res);
}, error => {
  console.log('p2失败', error);
});


/*
// 这种写法：因为return的第一个promise的resolve没有执行，所以p1返回的promise2的实例一直是pending态
let pp2 = p1.then(res => {
  return new Promise((resolve, reject) => {
    return new Promise((resolve, reject) => {
      resolve('嵌套的promise');
    });
  });
});
*/
