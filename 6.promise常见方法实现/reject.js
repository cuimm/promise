/*
* Promise.reject 内部实现
* */
Promise.reject = function(error) {
  return new Promise((resolve, reject) => {
    reject(error);
  });
};


/********** EXAMPLE  **********/
Promise.reject('error').then(res => {
  console.log(res);
}, error => {
  console.log(error);
});
