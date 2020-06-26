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
  then(onFulfilled, onRejected) {
    if (this.status === PROMISE_STATUS.FULFILLED) {
      onFulfilled(this.value);
    } else if (this.status === PROMISE_STATUS.REJECTED) {
      onRejected(this.error);
    } else if (this.status === PROMISE_STATUS.PENDING) { // executor里面的逻辑可能是异步的
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.error);
      });
    }
  }
}

module.exports = Promise;
