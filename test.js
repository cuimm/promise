console.log(1);
Promise.resolve(console.log(2)).then(res => {
    console.log(res);
})
console.log(3);


// 1
// 2
// 3
// undefined
