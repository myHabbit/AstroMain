---
author: Sat Naing
pubDatetime: 2024-01-04T09:30:41.816Z
title: AstroPaper 4.0
slug: "astro-paper-v4"
featured: true
ogImage: ../../assets/images/AstroPaper-v4.png
tags:
  - release
description: "AstroPaper v4: ensuring a smoother and more feature-rich blogging experience."
---

AstroPaper v4 的发布🎉，这是一项重大更新，引入了一系列新功能、改进和错误修复，以提升您的博客体验。

![AstroPaper v4](@assets/images/AstroPaper-v4.png)

## Table of contents

## 主要变化

### 升级到 Astro v4 [#202](https://github.com/satnaing/astro-paper/pull/202)

AstroPaper 现在利用了 Astro v4 的强大功能。然而，这是一个微妙的升级，不会破坏大多数 Astro 用户。

![Astro v4](https://astro.build/_astro/header-astro-4.GLp8HjfV.webp)

### 替换为 Astro 内容 `slug` [#197](https://github.com/satnaing/astro-paper/pull/197)

博客内容模式在 AstroPaper v4 中不再可用。最初 Astro 没有机制，因此我们必须自己弄清楚。从 Astro v3 开始，它支持内容收集和 slug 功能。现在，我们认为是时候采用 Astro 的开箱即用功能了。

** 文件: src/content/blog/astro-paper-4.md_**

```bash
---
author: Sat Naing
pubDatetime: 2024-01-01T04:35:33.428Z
title: AstroPaper 4.0
slug: "astro-paper-v4" # if slug is not specified, it will be 'astro-paper-4' (file name).
# slug: "" ❌ cannot be an empty string
---
```

现在的行为略有不同。在以前版本的 AstroPaper 中，如果未在博客文章（Markdown 文件）中指定 ，则该博客文章的标题将被 slug 化并用作 .但是，在 AstroPaper v4 中，如果未指定该字段，则 Markdown 文件名将用作 .要记住的一件事是，可以省略该字段，但它不能是空字符串（slug： “” ❌ ）。

如果您要将 AstroPaper 从 v3 升级到 v4，请确保将文件中的`src/content/blog/*.md` files with `slug`.

## 新功能

### 为内容创建添加代码片段 [#206](https://github.com/satnaing/astro-paper/pull/206)

AstroPaper 现在包含用于新博客文章的 VSCode 片段，无需手动复制/粘贴前言和内容结构（目录、标题、摘录等）


### 在博客文章中添加修改后的日期时间 [#195](https://github.com/satnaing/astro-paper/pull/195)

通过在博客文章中显示修改后的日期时间，让读者了解最新更新。这不仅灌输了用户对文章新鲜度的信任，还有助于改善博客的SEO。


如果您进行了修改，则可以在博客文章中添加一个。现在，帖子的排序行为略有不同。所有帖子都按 和 排序。如果一个帖子同时具有 a 和 ，则其排序位置将由 决定。如果没有，将仅考虑确定帖子的排序顺序.如果没有，将仅考虑确定帖子的排序顺序。

### 实现返回顶部按钮 [#188](https://github.com/satnaing/astro-paper/pull/188)

使用新实现的返回顶部按钮增强用户对博客详细信息文章的导航。


### 在标签帖子中添加分页 [#201](https://github.com/satnaing/astro-paper/pull/201)

通过在标签帖子中添加分页来改进内容组织和导航，使用户更容易浏览相关内容。这确保了如果一个标签有很多帖子，读者不会被所有与标签相关的帖子所淹没。


### 动态生成robots.txt[#130](https://github.com/satnaing/astro-paper/pull/130)

AstroPaper v4 现在动态生成robots.txt文件，让您更好地控制搜索引擎索引和网络爬虫。此外，站点地图URL也将添加到文件中。`robot.txt` file.

### 添加 docker-compose 文件 [#174](https://github.com/satnaing/astro-paper/pull/174)

现在，通过添加Docker-Compose文件，管理您的AstroPaper环境比以往任何时候都更容易，从而简化了部署和配置。

## 重构和错误修复

### 将 Slugified 标题替换为 Unslugified 标签名称 [#198](https://github.com/satnaing/astro-paper/pull/198)

为了提高清晰度、用户体验和 SEO，标签页面中的标题(`Tag: some-tag`) 不再被涂抹 (`Tag: Some Tag`).

![Unslugified Tag Names](https://github.com/satnaing/astro-paper/assets/53733092/2fe90d6e-ec52-467b-9c44-95009b3ae0b7)

### 实现 100svh 最小高度 ([79d569d](https://github.com/satnaing/astro-paper/commit/79d569d053036f2113519f41b0d257523d035b76))

我们更新了机身上的最小高度，使用 100svh，为移动用户提供更好的用户体验。

### 将网站 URL 更新为单一事实来源 [#143](https://github.com/satnaing/astro-paper/pull/143)

站点 URL 现在是单一事实来源，可简化配置并避免不一致。在此 [PR](https://github.com/satnaing/astro-paper/pull/143) 及其相关问题中阅读更多内容。

### 解决灯光模式下的不可见文本代码块问题  [#163](https://github.com/satnaing/astro-paper/pull/163)

我们修复了在浅色模式下不可见的文本代码块问题。

### 解码 Breadcrumb 中的 Unicode 标记字符 [#175](https://github.com/satnaing/astro-paper/pull/175)

痕迹导航中 Tag 的最后一部分现在已解码，使非英语 Unicode 字符显示得更好。

### 更新 LOCALE 配置以涵盖整个区域设置 ([cd02b04](https://github.com/satnaing/astro-paper/commit/cd02b047d2b5e3b4a2940c0ff30568cdebcec0b8))

LOCALE 配置已更新，以涵盖更广泛的区域设置，以满足更多样化的受众。

## 总结

我们相信这些更新将大大提升您的AstroPaper体验。感谢所有为AstroPaper做出贡献、解决问题并给予星星的人。我们期待看到您使用 AstroPaper v4 创建的惊人内容！

祝您博客愉快！

