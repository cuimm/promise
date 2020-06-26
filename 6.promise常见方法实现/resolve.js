/*
* Promise.resolve 内部实现
* */
Promise.resolve = function(value) {
  return new Promise(resolve => {
    resolve(value);
  });
};

/********** EXAMPLE  **********/
Promise.resolve(100).then(res => {
  console.log(res);
});
