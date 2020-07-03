/*
* 柯里化：可以理解为提前接收部分参数，延迟执行，不立即输出结果，而是返回一个接收剩余参数的函数
* */

/*
* 1、以下实现的柯里化函数，当定义函数的参数个数和传入的参数个数相等的时候，输出计算结果
* */
function currying__1(fn, arr = []) {
    const len = fn.length; // 函数的length属性等于参数的个数
    return function (...args) {
        let argArr = arr.concat(args)
        if (argArr.length < len) {
            return currying__1(fn, argArr); // 递归收集参数
        } else {
            return fn.apply(null, argArr);
        }
    }
}

// 定义一个接收3个参数的函数
function sum__1(a, b, c) {
    return a + b + c;
}

let currying__sum__1 = currying__1(sum__1); // 创建一个柯里化函数

console.log(currying__sum__1(1, 2, 3));
console.log(currying__sum__1(1)(2, 3));
console.log(currying__sum__1(1)(2)(3));

console.log('****************************************');


/*
 2、实现一个函数sum，运算结果可满足如下预期结果（通过调用 valueOf 方法，完成对参数的收集及计算）
     sum(1,2,3).valueOf() // 6
     sum(2,3)(2).valueOf() // 7
     sum(1)(2)(3)(4).valueOf() //10
     sum(2)(4,1)(2).valueOf() //9
* */
function currying__2(fn, arr = []) {
    const next = function (...args) {
        let argArr = arr.concat(args);
        return currying__2(fn, argArr);
    };
    next.valueOf = function () {
        return fn(...arr);
    };
    return next;
}

/** 以下写法不好，argArr对next来说是个公共变量
 function currying__2(fn) {
    let argArr = [];
    const next = function (...args) {
        argArr = argArr.concat(args);
        return next;
    };
    next.valueOf = function () {
        const result = fn(...argArr);
        argArr = []; // 此处如果不清空argArr，每次调用valueOf会在上次计算结果基础上累加
        return result;
    };
    return next;
}
 */

function sum__2(...args) {
    return args.reduce((a, b) => a + b, 0);
}

const currying__sum__2 = currying__2(sum__2);

console.log(currying__sum__2(1, 2, 3).valueOf());
console.log(currying__sum__2(2, 3)(2).valueOf());
console.log(currying__sum__2(1)(2)(3)(4).valueOf());
console.log(currying__sum__2(2)(4, 1)(2).valueOf());


console.log('****************************************');

/*
* 3、普通实现
* */
function sum(...args) {
    let argArr = args;
    const fn = function (...arr) {
        argArr = argArr.concat(arr);
        return fn;
    }
    fn.valueOf = function () {
        return argArr.reduce((a, b) => a + b, 0)
    }
    return fn;
}

console.log(sum(1, 2, 3).valueOf()); // 6
console.log(sum(2, 3)(2).valueOf()); // 7
console.log(sum(1)(2)(3)(4).valueOf()); //10
console.log(sum(2)(4, 1)(2).valueOf()); //9


console.log('****************************************');


/*
* 4、检查数据类型
* */
const utils = {};
const types = ['String', 'Number', 'Boolean', 'Object', 'Function', 'Undefined', 'Null'];

// 普通实现
// types.forEach(type => {
//     utils[`is${type}`] = function (value) {
//         return Object.prototype.toString.call(value) === `[object ${type}]`;
//     };
// });


const checkType = function (type, value) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
};

//** 柯里化实现
types.forEach(type => {
    utils['is' + type] = currying__1(checkType, [type]);
});

console.log(utils.isNumber(1));
console.log(utils.isString('a'));
console.log(utils.isUndefined(undefined));
console.log(utils.isNull(null));
console.log(utils.isObject({}));
console.log(utils.isFunction(() => {}));


