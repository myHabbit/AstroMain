---
author: Sat Naing
pubDatetime: 2024-04-018T14:58:53Z
modDatetime: 2024-04-20T12:05:56.066Z
title: axios的二次封装
slug: Secondary Packaging of Axios in Vue3+TS Environment
featured: true
draft: false
tags:
  - docs
  - javascript
  - Vue3TS
description: Secondary Packaging of Axios in Vue3+TS Environment.
---


Vue+Vite+TS 是当下Vue开发中非常流行的技术组合，它提供了快速、强类型的开发体验。在这中间，`axios`是一个常用的网络请求库。通过对`axios`进行二次封装，我们可以提高代码复用性，统一管理请求设置，简化错误处理，从而提升开发效率。简单来说，二次封装`axios`有助于让我们的代码更加整洁和易于维护。


## 目录
- [目录](#目录)
- [需要的环境](#需要的环境)
- [二次封装](#二次封装)
- [封装请求函数](#封装请求函数)
- [外部组件使用](#外部组件使用)
- [总结](#总结)

## 需要的环境

- 用 Vite 搭建一个 Vue3+TS 项目（确保已经全局安装了nodejs）。

```bash
npm create vue@latest

cd <your-project-name>

npm install

npm run dev

```

-  在项目中安装`axios`库。

```bash
npm install axios
```

## 二次封装


通常情况下会在项目根目录下创建一个`utils`文件夹，在这个文件夹中新建一个`index.ts`文件，在这个文件中，需要引入`axios`库，并引入`axios`库中的请求配置类型和响应类型；然后创建`axios`实例去配置`baseURL`和超时时间。然后添加请求响应拦截器，分别对请求和响应进行处理。 切记哦，要想在外部使用，需要将创建的`axios`实例导出。

```typescript

import axios from 'axios';

// 引入 axios 库中的请求配置类型和响应类型
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';


const server = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000
})

// 请求拦截器，对请求进行处理
server.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 在请求发送前可对请求配置进行处理
        return config
    }, (error: any) => {
        // 如果发生错误，通过 Promise.reject 方法返回错误信息
        return Promise.reject(error)
    })

// 响应拦截器，对响应进行处理
server.interceptors.response.use(
    (response: AxiosResponse) => {
        // 对响应数据进行处理
        return response

    }, (error: any) => {
        // 如果发生错误，通过 Promise.reject 方法返回错误信息
        return Promise.reject(error)
    }
)

// 导出创建的 axios 实例
export default server
```

## 封装请求函数

真实开发中，我们通常会封装一些请求函数，方便我们调用。跟着我走，带你完成这一步✌🏻  
首先呢，也是在项目根目录下创建一个`api`文件夹，在这个文件夹中，创建一个`index.ts`文件，在这个文件中，需要引入刚刚封装好的`axios`实例，并引入`axios`库中的请求配置类型和响应类型。然后创建一个请求函数，接收一个参数，这个参数是一个对象，对象中包含请求的配置信息，例如请求地址、请求方法、请求参数等。然后通过`axios`实例发送请求，并返回请求结果。

```ts
import server from '@/utils/index'

// 定义一个函数 getData，接收一个 id 参数
const getData = (id:number) => {
    // 发送一个 GET 请求到 '/demo' 地址，同时传递 id 参数
    return server({
        url: '/demo',
        method: 'get',
        params: { id }  // 参数
    })
}

// 导出函数 getData
export default getData
```

## 外部组件使用

封装好请求函数后，我们就可以像使用普通函数一样在外部组件中使用了。

```javascript

// 导入从 '@/axios/index' 模块中导出的 getData 函数
import getData from '@/axios/index'

// 导入 vue 中的 onMounted 钩子函数
import { onMounted } from 'vue';

// 在组件挂载后，异步调用 getData 函数，传递参数 1
onMounted(async () => {
    const data = await getData(1)
    console.log(data);
})
```

## 总结

根据上述步骤我们就已经完成了对`axios`的二次封装并且封装请求函数以及最终的请求函数使用。通过封装`axios`，我们可以提高代码复用性，统一管理请求设置，简化错误处理，从而提升开发效率。感谢阅读✌🏻