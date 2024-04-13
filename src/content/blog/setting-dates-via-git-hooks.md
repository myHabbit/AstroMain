---
author: Simon Smale
pubDatetime: 2024-03-07T20:40:08Z
modDatetime: 2024-03-20T18:59:05Z
title: Typed.js
featured: false
draft: false
tags:
  - docs
  - javascript
canonicalURL: https://smale.codes/posts/setting-dates-via-git-hooks/
description: How to use Git Hooks to set your Created and Modified Dates on AstroPaper
---

`Typed.js`是一个 JavaScript 打字动画库，它有着非常炫酷的打字效果。输入任何字符串，然后观看它 以您设置的速度键入，退格键入的内容，然后 为您设置的字符串数开始一个新句子。类似于打字机一样的效果，逐字逐句地显示文本，给用户一种逐渐浮现的感觉。

跟着我一起去了解它吧，Let go！

## 目录

- [目录](#目录)
- [安装](#安装)
- [使用](#使用)
- [案例示范](#案例示范)



## 安装

- CDN

```bash
<script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.9"></script>
```

- ESModule（选一个）:

```bash
npm install typed.js
yarn add typed.js
bower install typed.js
```


## 使用

- CDN使用

要通过`script`标签直接在浏览器中使用

```html
  <span id="element"></span>

  <script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js"></script>

  <script>
    var typed = new Typed('#element', {
      strings: ['<i>First</i> sentence.', '&amp; a second sentence.'],
      typeSpeed: 50,
    });
  </script>
</body>
```


要与 Vite 或者 Webpack 等构建工具一起使用，在`Vue`或在`React`应用程序中使用。


- VueJS 用法

```js

import Typed from 'typed.js';

const typed = new Typed('#element', {
  strings: ['<i>First</i> sentence.', '&amp; a second sentence.'],
  typeSpeed: 50,
});

```


- ReactJS 用法

```js

import React from 'react';
import Typed from 'typed.js';

function MyComponent() {
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['<i>First</i> sentence.', '&amp; a second sentence.'],
      typeSpeed: 50,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="App">
      <span ref={el} />
    </div>
  );
}
export default MyComponent;

```


以上两种方式在使用前必须得在项目中进行安装。

```js
import Typed from 'typed.js';
```


- 类型暂停

您可以通过包含转义字符在字符串中间暂停一段时间。

```js
var typed = new Typed('#element', {
  strings: ['First ^1000 sentence.', 'Second sentence.'],
});
```

- 智能后退间距
  
在以下示例中，这只会退格“This is a”后面的单词

```js
var typed = new Typed('#element', {
  strings: ['This is a JavaScript library', 'This is an ES6 module'],
  smartBackspace: true, // Default value
});
```



- 批量打字

以下示例将模拟终端在键入命令并查看其结果时的行为方式。

```js

var typed = new Typed('#element', {
  strings: ['git push --force ^1000\n `pushed to origin with option force`'],
});

```


- CSS

CSS 动画是在 JavaScript 中初始化的基础上构建的。但是，您可以随意自定义它们！这些类是：

```css

.typed-cursor {
}


.typed-fade-out {
}
```


## 案例示范

```js
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.9"></script>
  </head>
  <body>
    <div class="element"></div>

    <script type="text/javascript">
      window.onload = function () {
        var typed = new Typed(".element", {
          /**
           * @property {array} strings 要键入的字符串
           * @property {string} stringsElement 包含字符串子元素的元素的ID
           */
          strings: ['这些是默认值...', '你知道你应该做什么吗？', '使用你自己的吧！', '祝你有个美好的一天！'],
          stringsElement: null,

          /**
           * @property {number} typeSpeed 输入速度，以毫秒为单位
           */
          typeSpeed: 100,

          /**
           * @property {number} startDelay 键入之前的时间以毫秒开始
           */
          startDelay: 0,

          /**
           * @property {number} backSpeed 退格速度，以毫秒为单位
           */
          backSpeed: 100,

          /**
           * @property {boolean} smartBackspace 是否只退格与前一个字符串不匹配的内容
           */
          smartBackspace: true,

          /**
           * @property {boolean} shuffle 是否洗牌
           */
          shuffle: false,

          /**
           * @property {number} backDelay 退回之前的时间，以毫秒为单位
           */
          backDelay: 700,

          /**
           * @property {boolean} fadeOut 是否用淡出替代空格
           * @property {string} fadeOutClass 用于淡入淡出动画的css类
           * @property {boolean} fadeOutDelay 以毫秒为单位淡出延迟
           */
          fadeOut: false,
          fadeOutClass: 'typed-fade-out',
          fadeOutDelay: 500,

          /**
           * @property {boolean} loop 是否循环字符串
           * @property {number} loopCount 循环次数
           */
          loop: false,
          loopCount: Infinity,

          /**
           * @property {boolean} showCursor 是否显示光标
           * @property {string} cursorChar 光标的字符
           * @property {boolean} autoInsertCss 是否将光标和fadeOut的CSS插入HTML <head>
           */
          showCursor: true,
          cursorChar: '|',
          autoInsertCss: true,

          /**
           * @property {string} attr 输入属性
           * 例如：输入占位符，值或仅HTML文本
           */
          attr: null,

          /**
           * @property {boolean} bindInputFocusEvents 如果el是文本输入，则绑定到焦点和模糊
           */
          bindInputFocusEvents: false,

          /**
           * @property {string} contentType 明文的'html'或'null'
           */
          contentType: 'html',

          /**
           * 所有打字都已完成调用的回调函数
           * @param {Typed} self
           */
          onComplete: (self) => {
            console.log('所有打字都已完成调用的回调函数', self);
          },

          /**
           * 在键入每个字符串之前调用的回调函数
           * @param {number} arrayPos
           * @param {Typed} self
           */
          preStringTyped: (arrayPos, self) => {
            console.log('在键入每个字符串之前调用的回调函数', arrayPos, self);
          },

          /**
           * 输入每个字符串后调用的回调函数
           * @param {number} arrayPos
           * @param {Typed} self
           */
          onStringTyped: (arrayPos, self) => {
            console.log('输入每个字符串后调用的回调函数', arrayPos, self);
          },

          /**
           * 在循环期间，在键入最后一个字符串之后调用的回调函数
           * @param {Typed} self
           */
          onLastStringBackspaced: (self) => {
            console.log('在循环期间，在键入最后一个字符串之后调用的回调函数', self);
          },

          /**
           * 打字已经停止调用的回调函数
           * @param {number} arrayPos
           * @param {Typed} self
           */
          onTypingPaused: (arrayPos, self) => {
            console.log('打字已经停止调用的回调函数', arrayPos, self);
          },

          /**
           * 停止后开始键入调用的回调函数
           * @param {number} arrayPos
           * @param {Typed} self
           */
          onTypingResumed: (arrayPos, self) => {
            console.log('停止后开始键入调用的回调函数', arrayPos, self);
          },

          /**
           * 重置后调用的回调函数
           * @param {Typed} self
           */
          onReset: (self) => {
            console.log('重置后调用的回调函数', self);
          },

          /**
           * 停止后调用的回调函数
           * @param {number} arrayPos
           * @param {Typed} self
           */
          onStop: (arrayPos, self) => {
            console.log('停止后调用的回调函数', arrayPos, self);
          },

          /**
           * 开始后调用的回调函数
           * @param {number} arrayPos
           * @param {Typed} self
           */
          onStart: (arrayPos, self) => {
            console.log('开始后调用的回调函数', arrayPos, self);
          },

          /**
           * 销毁后调用的回调函数
           * @param {Typed} self
           */
          onDestroy: (self) => {
            console.log('销毁后调用的回调函数', self);
          }
        });
      }
    </script>
  </body>
</html>
```

以上是对该动画库的详细介绍，希望对大家有所帮助。最好还是要感谢作者的贡献，他的网站在这里：[Typed.js](www.mattboldt.com)