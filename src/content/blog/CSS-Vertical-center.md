---
author: Sat Naing
pubDatetime: 2024-4-29T15:22:00Z
modDatetime: 2024-5-06T09:12:47.400Z
title: CSS Vertical center
slug: CSS Vertical center
featured: true
draft: false
tags:
  - docs
  - css
description: Describe several ways to vertically center CSS
---

在平时开发当中，我们经常需要将元素垂直居中。这篇文章将介绍几种常用的方法，以实现元素的垂直居中。包括使用`flex`布局、`grid`布局、定位和位移等，希望对大家有帮助。

## 目录

- [目录](#目录)
- [需要的环境](#需要的环境)
- [flex布局](#flex布局)
- [grid布局](#grid布局)
- [定位和平移](#定位和平移)
- [表格单元格](#表格单元格)
- [垂直居中的内联块](#垂直居中的内联块)
- [总结](#总结)

## 需要的环境

需要一个基础的前端开发环境，包括 HTML 和 CSS。确保你已经安装了一个文本编辑器（例如 VS Code），并能通过浏览器查看 HTML 文件。

## flex布局

flex布局是现代 CSS 布局的首选方式，因为它灵活且易于使用。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>flex布局垂直居中</title>
    <style>
      .container {
        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center; /* 水平居中 */
        height: 100vh; /* 让容器的高度为100%视口高度 */
      }
      .content {
        background-color: lightblue;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">内容</div>
    </div>
  </body>
</html>
```

## grid布局

grid布局，也是一个强大的布局工具，适用于复杂的布局需求。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>grid布局垂直居中</title>
    <style>
      .container {
        display: grid;
        place-items: center; /* 垂直水平居中 */
        height: 100vh; /* 让容器的高度为100%视口高度 */
      }
      .content {
        background-color: lightcoral;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">内容</div>
    </div>
  </body>
</html>
```

## 定位和平移

使用`position`和`transform`也是一个常见的做法，适用于比较简单的布局。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Positioning Centering</title>
    <style>
      .container {
        position: relative;
        height: 100vh; /* 让容器的高度为100%视口高度 */
      }
      .content {
        background-color: lightgreen;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(
          -50%,
          -50%
        ); /* 向上和向左分别移动50%的自身宽度和高度 */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">Centered Content</div>
    </div>
  </body>
</html>
```

## 表格单元格

`table-cell`布局，适用于简单且需要兼容旧版浏览器的情况。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Table-cell Centering</title>
    <style>
      .container {
        display: table;
        height: 100vh; /* 让容器的高度为100%视口高度 */
        width: 100%;
      }
      .content {
        background-color: lightyellow;
        display: table-cell;
        vertical-align: middle; /* 垂直居中 */
        text-align: center; /* 水平居中 */
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">Centered Content</div>
    </div>
  </body>
</html>
```

## 垂直居中的内联块

这种方法可以用于文本或者内联元素的垂直居中。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inline-block Centering</title>
    <style>
      .container {
        height: 100vh;
        text-align: center; /* 水平居中 */
        white-space: nowrap; /* 避免换行 */
      }
      .container:before {
        content: "";
        display: inline-block;
        height: 100%; /* 让伪元素和容器等高 */
        vertical-align: middle;
      }
      .content {
        display: inline-block;
        vertical-align: middle; /* 垂直居中 */
        background-color: lightgray;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">Centered Content</div>
    </div>
  </body>
</html>
```

## 总结

根据上述方法，我们可以实现 HTML 和 CSS 中的垂直居中效果。选择哪种方法取决于具体的布局需求和项目的兼容性要求。希望这篇文章对你有帮助✌🏻
