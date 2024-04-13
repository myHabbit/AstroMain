let arr = [1,2,3,{a: 10}];
let newArr = [...arr]; // 这里发生浅拷贝
newArr[0]=0
newArr[3].a = 20; // 修改newArr中对象的属性a

console.log(arr[3].a); // 输出：20，因为arr和newArr中的对象是同一个引用