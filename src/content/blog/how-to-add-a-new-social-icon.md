---
author: Simon Smale
pubDatetime: 2024-03-18T18:16:00.000Z
modDatetime:
title: 梅花生长
featured: false
draft: false
tags:
  - docs
description: Canvas drawing plum blossom growth effect document
---

下面这个文档，教你如何实现一个基于 Vue 3  @vueuse/core 和 Canvas绘制的梅花生长动画。

## Table of contents

## 基础知识概述

在深入代码之前，请确保你对以下知识点有基本的了解：

- `HTML` 和 `CSS`
- `JavaScript` 基础（包括 ES6 语法）
- 基本的`Vue.js`概念，如组件、响应式系统、生命周期钩子等
- 绘图API `Canvas`

## 准备工作

在开始之前，确保你的项目已经安装了Vue 3 和 @vueuse/core。如果没有，你可以通过以下命令进行安装：

```bash
npm install vue@next
npm install @vueuse/core
```



## 设置Vue组件

首先，你需要在你的项目中创建一个新的Vue组件。可以命名为`Plum.vue`，然后按照以下步骤：

- 创建`DOM`元素以及书写行内样式

```js
<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden"
    style="z-index: -99; position: fixed; top: 0; left: 0; bottom: 0; right: 0;"
    :style="`mask-image: ${mask}; --webkit-mask-image: ${mask};`"
  >
    <canvas ref="el" width="400" height="400"></canvas>
  </div>
</template>
```
创建canvas元素，并设置其宽高为400x400，以便于绘制动画。  同时，设置其样式为`position: fixed; top: 0; left: 0; bottom: 0; right: 0;`，使其覆盖整个视口。

- 引入必要的`Vue Api`和`VueUse`库

```js
import { ref, reactive, onMounted, computed } from 'vue';
import { useWindowSize, useRafFn } from '@vueuse/core';
```

- `<script setup>`语法是Vue 3的新特性，它使得组件内代码更简洁。
- `ref`创建响应式引用变量。
- `reactive`创建响应式对象。
- `onMounted`生命周期钩子在DOM元素挂载后触发。
- `computed`用于创建基于其他响应式数据变化的计算属性。
- `useWindowSize`用于获取和响应窗口尺寸的变化。
- `useRafFn`用于创建和控制`requestAnimationFrame`的调用。


## 基本属性和全局变量初始化

在这里我们需要对`Canvas`元素设置基本的属性以及全局变量的初始化

```js
const r180 = Math.PI;
const r90 = Math.PI / 2;
const r15 = Math.PI / 12;
const color = '#88888825';

const el = ref(null);

const { random } = Math;
const size = reactive(useWindowSize());

const start = ref(() => {});
const MIN_BRANCH = 30;
const len = ref(6);
const stopped = ref(false);
```

这一部分初始化了几个重要的全局变量：一些基础的数学常量用于后续计算，`el`用于引用`canvas`元素，`size`用于存储窗口大小，其它的变量如`start`, `MIN_BRANCH`, `len`, `stopped`为绘画逻辑所使用。


## 初始化`Canvas`函数`initCanvas`

```js
// 初始化Canvas函数
function initCanvas(canvas, width = 400, height = 400, _dpi) {
  const ctx = canvas.getContext("2d");
  // 设备像素比，解决高DPI设备画面模糊的问题
  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  const dpi = _dpi || dpr / bsr;
  // 调整大小以适配高DPI屏幕
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = dpi * width;
  canvas.height = dpi * height;
  ctx.scale(dpi, dpi);
  return { ctx, dpi };
}
```
`initCanvas`函数接收三个参数：`canvas`为`Canvas`元素，`width`和`height`为`Canvas`元素的宽度和高度，`_dpi`表示一个设备每英寸可以显示或打印的点的数量，这里用于调整`Canvas`的分辨率。


## 极坐标转笛卡尔坐标函数`polar2cart`

极坐标系是数学中的一种坐标系统，需要通过一些数学转换来转换为直角坐标系（笛卡尔坐标系），用于画布上的绘图。

```js
function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
  const dx = r * Math.cos(theta);
  const dy = r * Math.sin(theta);
  return [x + dx, y + dy];
}
```
`polar2cart`函数接收一个点以及一个角度，并转换为笛卡尔坐标系下的点。这对于绘制基于角度和长度的直线非常有用。


## 组件挂载与动画逻辑

```js
// 组件挂载后初始化
onMounted(async () => {
  const canvas = el.value;
  const { ctx } = initCanvas(canvas, size.width, size.height);
  const { width, height } = canvas;

  let steps = [];
  let prevSteps = [];

  // 绘制步骤逻辑
  const step = (x, y, rad, counter = { value: 0 }) => {
    const length = random() * len.value;
    counter.value += 1;
    const [nx, ny] = polar2cart(x, y, length, rad);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    const rad1 = rad + random() * r15;
    const rad2 = rad - random() * r15;
    if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100) return;
    const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;
    if (random() < rate) steps.push(() => step(nx, ny, rad1, counter));
    if (random() < rate) steps.push(() => step(nx, ny, rad2, counter));
  };

```
- `onMounted`在组件挂载之后执行，此时可以安全地访问`DOM`元素。
- `Canvas`绘图API使用 `moveTo` 和 `lineTo` 方法来绘制线段。
- 分支逻辑通过递归和随机性来生成随机的绘图效果。

## 帧动画控制函数

```js
// 帧动画控制函数
const frame = () => {
  if (performance.now() - lastTime < interval) return;
  prevSteps = steps;
  steps = [];
  lastTime = performance.now();
  if (!prevSteps.length) {
    controls.pause();
    stopped.value = true;
  }
  prevSteps.forEach((i) => {
    if (random() < 0.5) steps.push(i);
    else i();
  });
}; 
```
这段代码主要是控制画布上的动画效果。具体逻辑如下：

- 首先，通过比较当前时间与上一次绘制的时间间隔`（performance.now() - lastTime）`，判断是否应该进行下一帧的绘制。这里的`interval`变量控制了帧之间的时间间隔，实际上是控制了绘制的速度。

- 如果需要进行下一帧的绘制，则将`prevSteps`（上一帧的绘制步骤）赋值给`prevSteps`，并将`steps`（当前帧的绘制步骤）清空，以便存储新的绘制步骤。

- 然后，判断上一帧的绘制步骤是否为空。如果为空，说明动画已经完成，此时暂停动画控制函数`（controls.pause()）`，并将`stopped.value`设为true，表示动画已停止。

- 如果上一帧的绘制步骤不为空，则遍历上一帧的绘制步骤，对每一个步骤进行处理。处理方式是：如果随机数小于0.5，则将该步骤重新添加到steps中，否则执行该步骤。

- 通过这样的逻辑，帧动画控制函数实现了对画布动画的控制和更新，使得画布上的分支动画可以流畅地进行。

## 启动动画函数

```js
start.value = () => {
   controls.pause();
   ctx.clearRect(0, 0, width, height);
   ctx.lineWidth = 1;
   ctx.strokeStyle = color;
   prevSteps = [];
   steps = [
     () => step(randomMiddle() * size.width, -5, r90),
     () => step(randomMiddle() * size.width, size.height + 5, -r90),
     () => step(-5, randomMiddle() * size.height, 0),
     () => step(size.width + 5, randomMiddle() * size.height, r180),
   ];
   if (size.width < 500) steps = steps.slice(0, 2);
   controls.resume();
   stopped.value = false;
 };
```

这段代码是初始化画布并开始动画的绘制过程。逻辑如下：

- 首先，通过调用`controls.pause()`暂停之前可能正在进行的动画。

- 然后，使用`ctx.clearRect(0, 0, width, height)`清空画布，确保画布上没有之前的绘制内容。

- 设置画笔的线宽和颜色，这里使用了之前定义的`color`变量作为笔触颜色。

- 将`prevSteps`清空，以确保开始时没有上一帧的绘制步骤。

- 根据指定的位置和角度，初始化`steps`数组，该数组包含了开始绘制的四个分支的绘制步骤。如果画布的宽度小于500，则仅保留前两个分支的绘制步骤。

- 最后，调用`controls.resume()`恢复动画控制函数，开始绘制动画，并将`stopped.value`设为false，表示动画未停止。

## 完整代码

```js
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useWindowSize, useRafFn } from "@vueuse/core";

const r180 = Math.PI;
const r90 = Math.PI / 2;
const r15 = Math.PI / 12;
const color = "#88888825";

const el = ref(null);

const { random } = Math;
const size = reactive(useWindowSize());

const start = ref(() => {});
const MIN_BRANCH = 30;
const len = ref(6);
const stopped = ref(false);

function initCanvas(canvas, width = 400, height = 400, _dpi) {
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  const dpi = _dpi || dpr / bsr;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = dpi * width;
  canvas.height = dpi * height;
  ctx.scale(dpi, dpi);

  return { ctx, dpi };
}

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
  const dx = r * Math.cos(theta);
  const dy = r * Math.sin(theta);
  return [x + dx, y + dy];
}

onMounted(async () => {
  const canvas = el.value;
  const { ctx } = initCanvas(canvas, size.width, size.height);
  const { width, height } = canvas;

  let steps = [];
  let prevSteps = [];

  const step = (x, y, rad, counter = { value: 0 }) => {
    const length = random() * len.value;
    counter.value += 1;

    const [nx, ny] = polar2cart(x, y, length, rad);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    const rad1 = rad + random() * r15;
    const rad2 = rad - random() * r15;

    if (
      nx < -100 ||
      nx > size.width + 100 ||
      ny < -100 ||
      ny > size.height + 100
    )
      return;

    const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;

    if (random() < rate) steps.push(() => step(nx, ny, rad1, counter));

    if (random() < rate) steps.push(() => step(nx, ny, rad2, counter));
  };

  let lastTime = performance.now();
  const interval = 1000 / 40;

  let controls;

  const frame = () => {
    if (performance.now() - lastTime < interval) return;

    prevSteps = steps;
    steps = [];
    lastTime = performance.now();

    if (!prevSteps.length) {
      controls.pause();
      stopped.value = true;
    }

    prevSteps.forEach((i) => {
      if (random() < 0.5) steps.push(i);
      else i();
    });
  };

  controls = useRafFn(frame, { immediate: false });

  const randomMiddle = () => random() * 0.6 + 0.2;

  start.value = () => {
    controls.pause();
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    prevSteps = [];
    steps = [
      () => step(randomMiddle() * size.width, -5, r90),
      () => step(randomMiddle() * size.width, size.height + 5, -r90),
      () => step(-5, randomMiddle() * size.height, 0),
      () => step(size.width + 5, randomMiddle() * size.height, r180),
    ];
    if (size.width < 500) steps = steps.slice(0, 2);
    controls.resume();
    stopped.value = false;
  };

  start.value();
});
const mask = computed(() => "radial-gradient(circle, transparent, black);");
</script>

<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden"
    style="z-index: -99; position: fixed;top: 0;left: 0;bottom: 0;right: 0;"
    :style="`mask-image: ${mask};--webkit-mask-image: ${mask};`"
  >
    <canvas ref="el" width="400" height="400" />
  </div>
</template>
```

## 总结

这篇文档主要实现了一个梅花生长动画的 `Vue` 组件，利用 `Vue 3` 和 `@vueuse/core` 库的功能，结合 `Canvas` 绘图基础知识和动态绘制算法。它通过初始化和监听窗口变化，实现了在 `Canvas` 上动态绘制线条来模拟梅花生长效果，同时应用了遮罩效果增强视觉效果。  
通过这个组件，我们可以轻松地在 `Vue` 项目中实现梅花生长动画效果，并自定义其样式和行为。
