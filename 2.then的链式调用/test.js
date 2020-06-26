const Promise = require('./promise');

let p1 = new Promise((resolve, reject) => {
  // 1、成功
  // resolve('success');

  // 2、失败
  // reject('failed');

  // 3、抛出异常
  // throw new Error('抛出异常');

  // 4、异步
  setTimeout(() => {
    resolve('异步success');
    // reject('异步failed');
  });
});

let p2 = p1.then(res => {
  console.log('p1成功', res);
  // return 'p1成功' + res;
  throw 'p1成功-抛出异常';
}, error => {
  console.log('p1失败', error);
  throw 'p1失败-抛出异常'
  // return 'p1失败' + error;
});

/*
* 1、如果then的成功或者失败的结果中，返回的还是一个promise，
*   会等待这个promise的执行结果，并将结果向外层的下一个then传递，并将结果传递到参数中
* 2、如果then（成功方法、失败方法）抛出异常的时候，会走下一次then的失败
*
* 只有2种情况走失败：
* 1、返回一个失败的promise
* 2、抛出异常
* */

p2.then(res => {
  console.log('p2成功', res);
}, error => {
  console.log('p2失败', error);
});
