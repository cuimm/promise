/*
* 1、Promise可以解决并发问题
* 2、Promise可以解决链式调用问题，解决多个回调嵌套问题
*
* Promise是一个类：
* 1、每次new一个Promise，都需要传递一个执行器，执行器立马执行
* 2、执行器有2个参数：resolve、reject，调用resolve就是成功，调用reject就是失败
* 3、默认Promise有3个状态：pending(等待态)、fulfilled(成功态)、rejected(失败态)，pending=>fulfilled表示promise成功了，pending=>rejected表示promise失败了
* 4、Promise一旦成功就不能变成失败态，一旦失败也不能变成成功态了
* 5、每个Promise实例都有一个then方法，then会返回一个全新的Promise实例
*
* then方法：
* 1、如果then的成功或者失败的结果中，返回的还是一个promise：
*   =>会等待这个promise的执行结果，并将结果向外层的下一个then传递，并将结果传递到参数中
* 2、如果then（成功方法、失败方法）抛出异常的时候，会走下一次then的失败
*
* 只有2种情况走reject：
* 1、返回一个失败的promise
* 2、抛出异常
*
* 终止promise的方式：
* 返回一个既不成功也不失败的promise
* */
const PROMISE_STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
};

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    // 这里x可能是一个promise对象 取then可能会发生异常
    try {
      let then = x.then;
      if (typeof then === 'function') {
        // 这里只能认为x是一个promise了
        // 让then执行：成功回调的参数是promise2中resolve的参数；失败回调的参数是promise2中reject的参数
        then.call(x, y => { // 用刚才取出来的then方法继续用，不要再次取then方法了（再次获取有可能会报错）
          // resolve(y);
          resolvePromise(promise2, y, resolve, reject); // y 可能还是一个promise，可以需要递归进行
        }, r => {
          reject(r);
        });
      } else {
        // x 是普通对象
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  } else {
    // x 是普通值类型
    resolve(x);
  }
}

class Promise {
  constructor(executor) {
    this.status = PROMISE_STATUS.PENDING;
    this.value = undefined;
    this.error = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = value => {
      if (this.status === PROMISE_STATUS.PENDING) {
        this.status = PROMISE_STATUS.FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(cb => cb());
      }
    };
    const reject = error => {
      if (this.status === PROMISE_STATUS.PENDING) {
        this.status = PROMISE_STATUS.REJECTED;
        this.error = error;
        this.onRejectedCallbacks.forEach(cb => cb());
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  /*
  * 要判断x是不是一个普通值
  * 1、如果x是一个普通值 => 把值直接传递给下一个then中
  * 2、如果x是一个promise => 需要获取这个x的状态
  * 3、如果执行出错 => 直接调用promise2的失败
  * */
  then(onFulfilled, onRejected) {
    // promise2 需要等待当前这次new的promise执行完毕之后才能获取到
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === PROMISE_STATUS.FULFILLED) {
        // 为了将promise2传递到resolvePromise中，使用setTimeout将promise2传递给异步的执行上下文
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.status === PROMISE_STATUS.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.error);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.status === PROMISE_STATUS.PENDING) { // executor里面的逻辑可能是异步的
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.error);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });
    return promise2; // 实现链式调用
  }
}

module.exports = Promise;
