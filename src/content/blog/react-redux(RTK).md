---
author: Sat Naing
pubDatetime: 2024-5-23T15:22:00Z
modDatetime: 2024-6-10T09:12:47.400Z
title: React-redux(RTK)
slug: React-redux(RTK)
featured: true
draft: false
tags:
  - docs
  - javascript
  - React
description: Detailed understanding of React-redux(RTK)
---

## Table of contents

- [Table of contents](#table-of-contents)
- [什么是 Redux](#什么是-redux)
- [核心概念](#核心概念)
- [安装](#安装)
  - [React 项目中安装](#react-项目中安装)
  - [HTML页面中引入cdn](#html页面中引入cdn)
- [Redux 基本使用方式](#redux-基本使用方式)
  - [创建 Reducer](#创建-reducer)
  - [创建 store](#创建-store)
  - [订阅 store](#订阅-store)
  - [发送 action](#发送-action)
- [Redux Toolkit（RTK）介绍](#redux-toolkitrtk介绍)
- [核心功能](#核心功能)
- [安装](#安装-1)
- [Redux Toolkit 基本使用](#redux-toolkit-基本使用)
  - [创建切片 Slice：](#创建切片-slice)
  - [配置 Store：](#配置-store)
  - [组件中使用](#组件中使用)
    - [main.tsx中配置](#maintsx中配置)
  - [模拟使用](#模拟使用)
- [总结](#总结)

## 什么是 Redux

Redux 是一个用于 JavaScript 应用的状态管理库。它的核心概念是通过一个全局状态树（store）来管理应用的状态。Redux 的设计理念包括单一数据源（Single Source of Truth）、状态是只读的（State is Read-Only）、使用纯函数（Reducers）来执行状态更新。

## 核心概念

Store：应用中唯一的状态树。通过 createStore 创建。
Action：状态变化的唯一来源，通常是一个包含 type 属性的对象。
Reducer：一个纯函数，接收当前的 state 和 action，返回新的 state。
Dispatch：发送 action 的方法。
Middleware：在 action 被发送到 reducer 之前拦截，可以用于处理异步操作。

## 安装

### React 项目中安装

```bash
npm install redux
```

### HTML页面中引入cdn

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/4.1.0/redux.min.js"></script>
```

## Redux 基本使用方式

### 创建 Reducer

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return state + 1;
    case "SUB":
      return state - 1;
    default:
      return state;
  }
}
```

### 创建 store

```javascript
const store = Redux.createStore(reducer, 1);
```

### 订阅 store

```javascript
store.subscribe(() => {
  // 这里可以执行一些操作，比如更新 UI等
  console.log(store.getState());
});
```

### 发送 action

```javascript
store.dispatch({ type: "ADD" });
store.dispatch({ type: "SUB" });
```

## Redux Toolkit（RTK）介绍

Redux Toolkit 是官方推荐的用于编写 Redux 逻辑的工具集。RTK 提供了简化的 API 和最佳实践，减少了样板代码，并改进了 Redux 应用的开发体验。

## 核心功能

configureStore：简化 store 配置。
createSlice：简化 reducer 和 actions 创建。
createAsyncThunk：处理异步逻辑。
createEntityAdapter：管理标准化数据。

## 安装

```bash
npm install @reduxjs/toolkit react-redux
```

## Redux Toolkit 基本使用

### 创建切片 Slice：

```tsx
// 使用RTK构建store

// 创建redux切片
import { configureStore, createSlice } from "@reduxjs/toolkit";

// 需要一个配置对象作为参数，通过对象的不同的属性指定配置信息
const stuSlice = createSlice({
  name: "student", //自动生成 action中的type
  initialState: {
    //state的初始值
    name: "孙悟空",
    age: 18,
    gender: "男",
    address: "花果山",
  },
  reducers: {
    //指定 state 的各种操作，直接在对象中添加方法
    setName(state, action) {
      // 通过不同的方法来指定对 state 的不同操作
      // 两个参数: state 当前的 state 这个 state 是一个代理对象，可以直接修改
      state.name = action.payload;
    },
    setAge(state, action) {
      state.age = action.payload;
    },
  },
});

export const { setName, setAge } = stuSlice.actions;
```

### 配置 Store：

```tsx
// 切片对象会自动帮助我们生成action
// actions中存储的是slice自动生成的action创建器(函数) 调用函数会自动创建action对象
// 自动生成的action对象会自动添加type属性(name/函数名)
// 自动生成的action对象会自动添加一个payload属性，payload属性会自动存储调用action创建器时传递的参数
// 创建store  需要一个配置对象作为参数

const store = configureStore({
  reducer: {
    student: stuSlice.reducer,
  },
});

export default store;
```

### 组件中使用

#### main.tsx中配置

这里需要用到 Provider 组件，包裹你的APP组件，这里因为我配置了路由，所以APP组件并不需要引入 所以我包裹的不是App组件。

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import store from "./store/index.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
```

### 模拟使用

首先要在组件中引入useSelector, useDispatch 两个钩子函数来获取state和派发器dispatch，然后通过useSelector获取state中的数据，通过useDispatch获取派发器dispatch，然后通过dispatch派发action来修改state中的数据。

```tsx
import { useSelector, useDispatch } from "react-redux";
import { setName } from "./store";

export default function App() {
  interface Student {
    name: string;
    age: number;
    gender: string;
    address: string;
  }

  // 获取派发器对象
  const dispatch = useDispatch();

  // 获取state
  const student = useSelector((state: { student: Student }) => {
    return state.student;
  });

  const setNameHandler = () => {
    dispatch(setName("沙和尚"));
  };

  return (
    <div>
      <button onClick={se}>点击修改姓名</button>
    </div>
  );
}
```

## 总结

Redux 提供了一个强大的状态管理机制，适用于大型应用。然而，它的样板代码较多，配置复杂。Redux Toolkit (RTK) 通过简化 API 和提供最佳实践，使得 Redux 应用的开发更加高效和简洁。通过 RTK，可以轻松配置 store、创建 slices 以及处理异步逻辑，是现代 Redux 应用开发的推荐方式。感谢阅读✌🏻
