1、Promise可以解决并发问题
2、Promise可以解决链式调用问题，解决多个回调嵌套问题

Promise是一个类：
1、每次new一个Promise，都需要传递一个执行器，执行器立马执行
2、执行器有2个参数：resolve、reject，调用resolve就是成功，调用reject就是失败
3、默认Promise有3个状态：pending(等待态)、fulfilled(成功态)、rejected(失败态)，pending=>fulfilled表示promise成功了，pending=>rejected表示promise失败了
4、Promise一旦成功就不能变成失败态，一旦失败也不能变成成功态了
5、每个Promise实例都有一个then方法，then会返回一个全新的Promise实例

then方法：
1、如果then的成功或者失败的结果中，返回的还是一个promise：
=>会等待这个promise的执行结果，并将结果向外层的下一个then传递，并将结果传递到参数中
2、如果then（成功方法、失败方法）抛出异常的时候，会走下一次then的失败

只有2种情况走reject：
1、返回一个失败的promise
2、抛出异常

终止promise的方式：
返回一个既不成功也不失败的promise
