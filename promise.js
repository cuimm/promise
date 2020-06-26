const PROMISE_STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
};

function isPromise(val) {
  if ((val !== null && typeof val === 'object') || typeof val === 'function') {
    return typeof x.then === 'function';
  }
  return false;
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }
  let called;
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
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
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }

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
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err};

    const promise2 = new Promise((resolve, reject) => {
      if (this.status === PROMISE_STATUS.FULFILLED) {
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
      } else if (this.status === PROMISE_STATUS.PENDING) {
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
    return promise2;
  }
  catch(errorCallback) {
    return this.then(null, errorCallback);
  }
  finally(callback) {
    return this.then(value => {
      return Promise.resolve(callback()).then(() => value);
    }, error => {
      return Promise.resolve(callback()).then(() => {throw error});
    });
  }
  static all(promises) {
    return new Promise((resolve, reject) => {
      let arr = [];
      let index = 0;
      let processData = (i, y) => {
        arr[i] = y;
        if (++index === promises.length) {
          resolve(arr);
        }
      };
      for (let i = 0; i < promises.length; i++) {
        let value = promises[i];
        if (isPromise(value)) {
          value.then(y => {
            processData(i, y);
          }, reject);
        } else {
          processData(i, value);
        }
      }
    });
  }
  static race(promises) {
    return new Promise((resolve, reject) => {
      for(let i = 0; i < promises.length; i++) {
        const value = promises[i];
        if (isPromise(value)) {
          value.then(resolve, reject);
        } else {
          resolve(value);
        }
      }
    });
  }
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }
  static reject(error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
}

Promise.defer = Promise.deferred = function() {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};


// promises-aplus-tests promise.js 执行该命令测试Promise

module.exports = Promise;
