/*
* 1、generator 是生成器（生成的是迭代器）
* 2、iterator 是迭代器（迭代器的作用：没有迭代器的数据，不能被迭代，既不能被循环）
* 3、什么样的数据能迭代？=> 有索引、有长度、能遍历
* 4、类数组转化为数组
*   => 1)、[...arguments]：可以将类数组转成数组，该类数组必须有索引、有长度、有迭代器。
*   => 2)、Array.from(arguments)：将类数组转成数组，Array.from转换数组的时候，不需要迭代器。
* 5、Symbol中有很多"元编程"的方法，可以更改JS本身的功能。
*
* 如果我们自己去迭代一个对象需要实现一个迭代器接口，自己返回一个具有next方法的对象。
* 内部会调用这个next方法返回结果包含value和done,当done为true时迭代完成。
* */

// 模拟类数组：默认这样写的数组是不能被迭代的，缺少迭代方法。（但可以使用Array.from方法转成数组）
let likeArray = {'0': 1, '1': 2, '2': 3, '3': 4, length: 4};

// Symbol中有很多"元编程"的方法，可以更改JS本身的功能。
// 给likeArray添加迭代方法
likeArray[Symbol.iterator] = function () {
    // 迭代器是一个对象，对象中有next方法，每次调用next，都需要返回一个对象，对象结构：{value, done}
    let index = 0;
    return {
        // 迭代的时候会自动调用这个方法
        next: () => {
            return {
                value: this[index],
                done: index++ === this.length,
            }
        },
    };
};
console.log([...likeArray]); // [1,2,3,4]

console.log('*******************************************************');

/*
* generator生成器 生成的是 iterator迭代器
* function * 表示该方法是一个generator方法，碰到yield会被暂停
* */
let likeArray__2 = {'0': 5, '1': 6, '2': 7, '3': 8, length: 4};

likeArray__2[Symbol.iterator] = function* () {
    let index = 0;
    while (index < this.length) {
        yield this[index++];
    }
};
console.log([...likeArray__2]); // [ 5, 6, 7, 8 ]

console.log('*******************************************************');

/*
* 生成器是ES6的一个api
* generator函数，碰到 yield 就会暂停
* */
function* read() {
    yield 1;
    yield 2;
    yield Promise.resolve(3);
    return 100;
}

let it = read(); // 生成器返回的是迭代器
console.log(it.next()); // { value: 1, done: false }
console.log(it.next()); // { value: 2, done: false }
console.log(it.next()); // { value: 3, done: false }
console.log(it.next()); // { value: 100, done: true }

console.log('*******************************************************');

/*
* 通过generator函数可以来优化promise（promise的特点：不停的回调、不停的链式调用）
*
* */
const fs = require('fs').promises;

function* read__3() {
    let name = yield fs.readFile('./assets/name.txt', 'utf-8');
    let age = yield fs.readFile(`./assets/${name.trim()}.txt`, 'utf-8');
    return age;
}

/*
* 封装co方法，传入上面generator方法，返回Promise实例
* */
function co(it) {
    return new Promise((resolve, reject) => {
        // 异步迭代 需要根据函数来实现
        function $next(data) {
            const {value, done} = it.next(data); // 除了第一次的传参没有意义外，剩下的传参结果会赋予给 上一次的yield的返回的值
            if (done) {
                resolve(value);
            } else {
                // Promise.resolve(value).then($next, reject); // 直接让promise变成成功 用当前返回的结果
                Promise.resolve(value)
                    .then(res => {
                        $next(res)
                    })
                    .catch(error => {
                        reject(error)
                    })
            }
        }

        $next(); // 递归迭代
    });
}

// 执行
co(read__3())
    .then(res => {
        console.log('res', res);
    })
    .catch(error => {
        console.log(error);
    });

/*
let it__3 = read__3();
let {value, done} = it__3.next();
value.then(res => {
    let {value, done} = it__3.next(res);
    value.then(res => {
        console.log(res); // 18
    }).catch(error => {
        console.log(error);
    });
});
*/

