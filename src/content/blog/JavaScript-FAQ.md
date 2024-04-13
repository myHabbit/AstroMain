---
author: Simon Smale
pubDatetime: 2024-04-01T20:40:08Z
modDatetime: 2024-04-08T18:59:05Z
title: JavaScript常见手写题
featured: false
draft: false
tags:
  - docs
  - FAQ
  - JavaScript
canonicalURL: https://smale.codes/posts/setting-dates-via-git-hooks/
description: Compilation of Common Handwritten Questions in JavaScript
---

这篇文章是我对JavaScript面试常见手写题的整理

## 目录
- [防抖](#防抖)
- [节流](#节流)
- [深浅拷贝](#深浅拷贝)
- [原生AJAX](#原生ajax)
- [数组去重](#数组去重)
- [数组扁平化](#数组扁平化)

## 防抖

防抖(debounce)是在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

看一个🌰（栗子）：
```js
//模拟一段ajax请求
function ajax(content) {
  console.log('ajax request ' + content)
}

let inputa = document.getElementById('unDebounce')

inputa.addEventListener('keyup', function (e) {
    ajax(e.target.value)
})
```
如果是这样写的话，每当用户按下键盘，就会触发一次`ajax`请求，这显然不是我们想要的。我们希望的是，用户输入完后，再触发一次`ajax`请求。这样可以减少请求次数，提高性能。

针对这个问题，我们可以这样写：
```js
<input type="text" id="inp">
  <script>
      const inp = document.getElementById('inp');
      function debounce(fn, delay) {
          let time = null
          return function () {
              if (time) {
                  clearTimeout(time)
              }
              time = setTimeout(() => {
                  fn()
              }, delay)
          }
      }
      inp.addEventListener('input', debounce(function () {
          console.log(inp.value)
      }, 1000))
  </script>
```
我们加入了防抖以后，当你在频繁的输入时，并不会去触发打印，只有当你在指定间隔内没有输入时，才会执行函数。如果停止输入但是在指定间隔内又输入，会重新触发计时。

## 节流

规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

当用户在网页上滚动时触发的事件是一个需要节流的例子。在这种情况下，如果没有节流，滚动事件可能会频繁地触发，导致浏览器执行过多的处理工作，影响页面的性能和响应速度。通过节流，可以限制滚动事件的触发频率，以减少浏览器的负担，提高页面的性能。

针对上述需求，我们可以这样写：
```js
// 节流函数
function throttle(func, delay) {
  let timeoutId;
  return function(...args) {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        timeoutId = null;
      }, delay);
    }
  };
}

// 处理滚动事件的函数
function handleScroll() {
  console.log("页面正在滚动...");
  // 在这里执行滚动事件的处理逻辑
}

// 使用节流函数包装处理滚动事件的函数
const throttledScroll = throttle(handleScroll, 1000); // 这里的1000是延迟时间，单位是毫秒

// 添加滚动事件监听器
window.addEventListener("scroll", throttledScroll);
```

在上面的代码中，我们首先定义了一个节流函数`throttle`，它接受一个函数和一个延迟时间作为参数，返回一个新的函数。这个新函数在被调用时会检查是否已经存在一个定时器。如果没有，就设置一个定时器来调用原始函数，并在延迟时间后将定时器标识重置为`null`。如果在延迟时间内再次调用该函数，则不会执行任何操作，直到延迟时间过去，定时器被重置。所以当用户在滚动事件中频繁触发时，只有当延迟时间过去后才会执行函数。

#### 防抖和节流的区别

防抖和节流都是用来控制函数的执行频率的。它们的区别在于，防抖是在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。而节流是在事件被触发n秒后才执行回调，如果在这n秒内又被触发，则忽略。

#### 结合应用场景

防抖

`search`搜索用户在不断输入值时，用防抖来节约请求资源。
`window`触发`resize`的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次


节流

鼠标不断点击触发，`mousedown`(单位时间内只触发一次)
监听滚动事件，比如是否滑到底部自动加载更多，用`throttle`来判断



## 深浅拷贝

- 浅拷贝：创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。
   
- 深拷贝：将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象。

#### 浅拷贝的实现方式：

- Object.assign()
  
`Object.assign()`方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。

```js
let obj1 = { person: {name: "kobe", age: 41},sports:'basketball' };
let obj2 = Object.assign({}, obj1);
obj2.person.name = "wade";
obj2.sports = 'football'
console.log(obj1); // { person: { name: 'wade', age: 41 }, sports: 'basketball' }
```

- 展开运算符

展开运算符是一个 es6 / es2015特性，它提供了一种非常方便的方式来执行浅拷贝，这与`Object.assign()`的功能相同。

```js
let obj1 = { name: 'Kobe', address:{x:100,y:100}}
let obj2= {... obj1}
obj1.address.x = 200;
obj1.name = 'wade'
console.log('obj2',obj2) // obj2 { name: 'Kobe', address: { x: 200, y: 100 } }
```

- 函数库lodash的_.clone方法

该函数库也有提供_.clone用来做 Shallow Copy,后面我们会再介绍利用这个库实现深拷贝。

```js
var _ = require('lodash');
var obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};
var obj2 = _.clone(obj1);
console.log(obj1.b.f === obj2.b.f);// true
```

- Array.prototype.concat()

```js
let arr = [1, 3, {
    username: 'kobe'
    }];
let arr2 = arr.concat();    
arr2[2].username = 'wade';
console.log(arr); //[ 1, 3, { username: 'wade' } ]
```

- Array.prototype.slice()

```js
let arr = [1, 3, {
    username: ' kobe'
    }];
let arr3 = arr.slice();
arr3[2].username = 'wade'
console.log(arr); // [ 1, 3, { username: 'wade' } ]
```

#### 深拷贝的实现方式：

- JSON.parse(JSON.stringify())
  
```js
let arr = [1, 3, {
    username: ' kobe'
}];
let arr4 = JSON.parse(JSON.stringify(arr));
arr4[2].username = 'duncan'; 
console.log(arr, arr4)

```
这是利用`JSON.stringify`将对象转成`JSON`字符串，再用`JSON.parse`把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。

- 函数库lodash的_.cloneDeep方法

```js
var _ = require('lodash');
var obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};
var obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f);// false
```

- 手写递归方法

递归方法实现深度克隆原理：遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝。

```js
function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) return
    let objCopy = obj instanceof Array ? [] : {}
    for (let key in obj){
        if(obj.hasOwnProperty(key)){
            if (obj[key] instanceof Object) {
                objCopy[key] = deepCopy(obj[key])
            } else{
                objCopy[key] = obj[key]
            }
        }
    }
    return objCopy
}
```

## 原生ajax

`AJAX`全称为“Asynchronous JavaScript and XML”（异步JavaScript和 XML），是一种创建交互式网页应用的网页开发技术。通过在后台与服务器进行少量数据交换，`Ajax`可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。而传统的网页(不使用 Ajax)如果需要更新内容，必需重载整个网页面。

#### AJAX的工作原理

`Ajax`的工作原理相当于在用户和服务器之间加了一个中间层(AJAX引擎)，使用户操作与服务器响应异步化。客户端发送请求，请求交给`xhr`，`xhr`把请求提交给服务器，服务器进行业务处理，服务器响应数据交给`xhr`对象，`xhr`对象接收数据，由`javascript`把数据写到页面上。


#### AJAX请求的五个步骤

- 建立`XMLHttpRequest`对象;
  
```js
const xhr = new XMLHttpRequest();
```

- 设置回调函数;

```js
xhr.onreadystatechange = callback；
```

- 配置请求信息，(如open,get方法)，使用`open`方法与服务器建立链接;
  
```js
// get 方式
xhr.open("get", "test.php", true)

// post 方式发送数据 需要设置请求头
xhr.open("post", "test.php", true)
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
```

- 向服务器发送数据;

```js

// get 不需要传递参数
xhr.send(null)
// post 需要传递参数
xhr.send("name=jay&age=18")
```

- 在回调函数中针对不同的响应状态进行处理;

```js
function callback() {
  // 判断异步对象的状态
  if(xhr.readyState == 4) {
    // 判断交互是否成功
    if(xhr.status == 200) {
      // 获取服务器响应的数据
      var res = xhr.responseText
      // 解析数据
      res = JSON.parse(res)
    }
  }
}
```
#### ajax中的五种状态码

- 0：请求未初始化

- 1：服务器连接已建立(已调用open方法，但还未调用send)

- 2：请求已接收(已调用send方法)

- 3：请求处理中(请求已到达服务端，正在处理)

- 4：请求已完成，且响应已就绪

- 状态： 200——正确、404——未找到页面、500——错误

#### AJAX请求成功和失败判断

- `ajax` 的 `success` 和 `error` 方法根据响应状态码来触发。  
- 当 `XMLHttpRequest.status` 为 200 的时候，表示响应成功，此时触发 `success()` 其他状态码则触发 `error()`。


## 数组去重

关于数组去重是在面试中经常遇到的问题，也是在日常开发中经常被使用的，这里我详细总结了7种数组去重的方式。

- 利用`Set()` + `...`展开运算符实现去重

`Set`对象：是值的集合，你可以按照插入的顺序迭代它的元素。 `Set`中的元素只会出现一次，即`Set中`的元素是唯一的。
`...`展开运算符：是es6新增的语法，可以将数组中的元素展开。

```js
let arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
let arr1 = [...new Set(arr)];
console.log(arr1)
```

注意：以上去方式对`NaN`和`undefined`类型去重也是有效的，是因为`NaN`和`undefined`都可以被存储在`Set`中。

- 利用数组的`indexOf`方法

`indexOf()` 方法用于查找数组中某个元素第一次出现的位置索引。它接受一个参数，即要查找的元素，然后返回该元素在数组中第一次出现的索引位置。如果数组中不存在该元素，则返回 -1。

具体思路：新建一个空数组，遍历需要去重的数组，将数组元素存入新数组中，存放前判断数组中是否已经含有当前元素，没有则存入。此方法也无法对`NaN`去重。


```js
function removeDuplicate(arr) {
  const newArr = []
  arr.forEach(item => {
    if (newArr.indexOf(item) === -1) {
      newArr.push(item)
    }
  })
  return newArr // 返回一个新数组
}

const result = removeDuplicate(arr)
console.log(result) 
```

- 利用数组的`includes`方法

`includes()`方法：用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false。

具体思路：逻辑与indexOf方法去重异曲同工，只是用`includes`方法来判断是否包含重复元素。

```js
function removeDuplicate(arr) {
  const newArr = []
  arr.forEach(item => {
    if (!newArr.includes(item)) {
      newArr.push(item)
    }
  })
  return newArr
}

const result = removeDuplicate(arr)
console.log(result)

```


- 利用数组的`filter()` + `indexOf()`

`filter()` 方法：会创建一个新数组，其包含通过所提供函数实现的测试的所有元素。

具体思路：`filter`方法会对满足条件的元素存放到一个新数组中，结合`indexOf`方法进行判断。

```js
function removeDuplicate(arr) {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index
  })
}

const result = removeDuplicate(arr)
console.log(result)

```

- 利用`Map()`

`Map` 对象：用于保存键值对，并且能够记住键的原始插入顺序。任何值（对象或者原始值）都可以作为一个键或一个值。

实现思路：`Map`对象是 JavaScript 提供的一种数据结构，结构为键值对形式，将数组元素作为`map`的键存入，然后结合`has()`和`set()`方法判断键是否重复。

```js
function removeDuplicate(arr) {
  const map = new Map()
  const newArr = []

  arr.forEach(item => {
    if (!map.has(item)) { // has()用于判断map是否包为item的属性值
      map.set(item, true) // 使用set()将item设置到map中，并设置其属性值为true
      newArr.push(item)
    }
  })

  return newArr
}

const result = removeDuplicate(arr)
console.log(result)
```

- 利用对象

其实现思想和Map()是差不多的，主要是利用了对象的属性名不可重复这一特性。

```js

function removeDuplicate(arr) {
  const newArr = []
  const obj = {}

  arr.forEach(item => {
    if (!obj[item]) {
      newArr.push(item)
      obj[item] = true
    }
  })

  return newArr
}

const result = removeDuplicate(arr)
console.log(result)
```


## 数组扁平化


数组扁平化也是面试中的常考点，接下来让我们一起总结一下知识点以及实现方法吧。

JavaScript 中的数组扁平化是指将多维数组（包含嵌套数组）转换为一维数组的过程。这样可以简化数组的结构，使得操作更加方便和灵活。

#### 具体的实现方法：

- 普通递归方法

实现思路：使用递归函数，通过遍历数组中的每个元素，检查它是否还是一个数组。如果是，则对子数组进行同样的扁平化操作，并将结果合并到最终的一维数组中。

```js
let arr = [1,2,[3,4,[5,6]]]

function flattenArray(arr) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flattenArray(arr[i]));
    } else {
      result.push(arr[i])
    }
  }
  return result
}

console.log(flattenArray(arr));  // [ 1, 2, 3, 4, 5, 6 ]
```

-  `reduce()` 方法

实现思路：利用`Array.prototype.reduce()`函数的累加器特性，遍历数组并将子数组扁平化后的结果合并到最终的一维数组中。其实也是递归，不过不像上面一样用`for`循环，和上面代码差别不大，这里主要是利用了`reduce`方法，代码书写起来更简洁。

```js
let arr = [1,2,[3,4,[5,6,[7,8]]]]

function flattenWithReduce(arr) {
  return arr.reduce((acc, val) => 
    acc.concat(Array.isArray(val) ? flattenWithReduce(val) : [val]),
    []
  );
}

console.log(flattenWithReduce(arr))
```

优点：可读性强，逻辑清晰，无需额外创建函数闭包。 缺点：对于非常深的嵌套结构，性能可能不如使用`flat()`方法。

- Array.prototype.flat()

ES6 引入了`flat()`方法用于将一个数组中的所有子数组扁平化为一个一维数组。它接受一个可选的参数，用于指定扁平化深度。默认情况下，`flat()`方法将扁平化到数组的任意深度。

```js
let arr = [1,2,[3,4,[5,6,[7,8,[9]]]]]

function flattenWithFlat(arr) {
  return arr.flat(Infinity) 
}

console.log(flattenWithFlat(arr)) 

```

优点：简洁高效，原生支持，适合现代浏览器环境。 缺点：旧版浏览器不支持此方法，需要`polyfill`或其他兼容方案。

- 扩展运算符与`concat`

实现思路：利用扩展运算符`（...）`和`concat()`结合，逐步展开嵌套数组。

```js
let arr = [1,2,[3,[4],[5,6,[7,8,[9]]]]]

function flattenWithSpread(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

console.log(flattenWithSpread(arr));

```

优点：代码相对简洁，易于理解。 缺点：循环执行次数取决于数组嵌套深度，效率相对较低。

- lodash库的`_.flattenDeep()`

lodash 库提供了一个现成的方法`_.flattenDeep()`，可以处理任意深度的嵌套数组。

```js

import _ from 'lodash'

let arr = [1,2,[3,[4],[5,6,[7,8,[9]]]]] 

const flattenedArr = _.flattenDeep(nestedArr)

console.log(flattenedArr)

```



