/*
* catch 内部实现
* */
Promise.prototype.catch = function (errorCallback) {
  return this.then(null, errorCallback);
};

/********** EXAMPLE  **********/
new Promise((resolve, reject) => {
  reject('error');
}).then(res => {
  console.log('100', res);
}).catch(error => {
  console.log('200', error);
  return 200;
}).then(res => {
  console.log(300, res);
});

