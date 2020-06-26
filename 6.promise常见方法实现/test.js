// const Promise = require('./promise');
const fs = require('fs');

// catch其实是.then(null, err=>{...})
new Promise((resolve, reject) => {
  reject('失败');
}).then(res => {
  console.log(res);
}).catch(error => {
  console.log('catch', error);
}).then(res => {
  console.log(res);
  return 100;
}).finally(() => {
  console.log('finnally');
}).then(res => {
  console.log(res);
});

// resolve
Promise.resolve(200).then(res => {
  console.log('200', res);
});

// defer
Promise.defer = function () {
  const defer = {};
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};
