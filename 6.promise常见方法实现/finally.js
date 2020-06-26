/*
* finally 内部实现
* finally 可以将上一个promise返回的成功或者失败结果传递给下一个promise
* */
Promise.prototype.finally = function (callback) {
  return this.then(value => {
    return Promise.resolve(callback()).then(() => value);
  }, error => {
    return Promise.resolve(callback()).then(() => {throw error});
  });
};

Promise.prototype.finally = function (callback) {
  // 这里需要调用then方法：需要拿到上一个promise的返回值
  return this.then(value => { // 这里的value是上一个promise成功态的返回值
    // finally 可能会返回一个promise => 需要等待这个promise执行完毕在执行下一步，并且将上一个promise返回值往下传递
    return Promise.resolve(callback()).then(() => value);
    // callback();
    // return value;
  }, error => { // 这里的error是上一个promise执行失败态的返回值
    return Promise.resolve(callback()).then(() => {throw error});
    // callback();  // callback 可能返回的是一个promise，所以需要等待它执行完毕在往下执行
    // throw error;
  });
};


/********** EXAMPLE  **********/
new Promise((resolve, reject) => {
  resolve(100);
  // reject(200);
}).then(res => {
  console.log('1.then', res);
  // return '1.then' + res;
  throw '1.then throw'
}).catch(err => {
  console.log('1.catch', err);
  throw '1.catch throw'
}).finally(() => {
  console.log('finally');
  // throw 'finally 抛出异常';  // finally抛出的异常会被下一个promise捕获
  // return 'finally返回值'; // finally返回的结果会被忽略
  return new Promise((r, j) => { // finally可能会返回一个promise，会等待这个promise执行完毕之后在执行下一个promise
    setTimeout(() => {
      r('finally ok');
    }, 1000);
  });
}).then(res => {
  console.log('2.then', res);
}).catch(err => {
  console.log('2.catch', err);
});
