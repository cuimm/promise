const fs = require('fs');

/*
* defer 内部实现
* */
Promise.defer = Promise.deferred = function() {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};


/********** EXAMPLE  **********/
function read() {
  const defer = Promise.defer();
  fs.readFile('./assets/name.txt', 'utf-8', (error, data) => {
    if (error) {
      defer.reject(error);
    } else {
      defer.resolve(data);
    }
  });
  return defer.promise;
}

read().then(res => {
  console.log(res);
}, err => {
  console.log(err);
})
