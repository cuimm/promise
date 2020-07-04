// 模拟接口调用，3s后返回结果
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('5秒后成功回调')
    }, 5000);
});

// p1
//     .then(res => {
//         console.log(res);
//     })
//     .catch(error => {
//         console.log(error);
//     });

function wrap(promise, seconds) {
    // return new Promise((resolve, reject) => {
        let p = new Promise((resolve, reject) => {
            setTimeout(() => reject('timeout'), seconds);
        });
        return Promise.race([promise, p]);
    // });
}

// 超过3秒，则报错
wrap(p1, 3000)
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    });
