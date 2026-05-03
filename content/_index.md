---
title: 我的网站
layout: hextra-home
---

{{< hextra/hero-badge >}}
  <div class="hx:w-2 hx:h-2 hx:rounded-full hx:bg-primary-400"></div>
  <span>欢迎访问</span>
  {{< icon name="arrow-circle-right" attributes="height=14" >}}
{{< /hextra/hero-badge >}}

<div class="hx:mt-6 hx:mb-6">
{{< hextra/hero-headline >}}
  欢迎来到我的网站
{{< /hextra/hero-headline >}}
</div>

<div class="hx:mb-12">
{{< hextra/hero-subtitle >}}
  分享知识、记录成长、探索技术
{{< /hextra/hero-subtitle >}}
</div>

<div class="hx:mb-6">
{{< hextra/hero-button text="开始阅读" link="docs" >}}
  {{< hextra/hero-button text="博客文章" link="posts" >}}
</div>

<div class="hx:mt-6"></div>

{{< hextra/feature-grid >}}
  {{< hextra/feature-card
    title="📚 文档中心"
    subtitle="整理和分享技术文档、教程和学习笔记"
    icon="book-open"
  >}}
  {{< hextra/feature-card
    title="📝 博客文章"
    subtitle="记录技术探索、项目经验和个人成长"
    icon="pencil"
  >}}
  {{< hextra/feature-card
    title="💡 技术分享"
    subtitle="分享前端、后端、工具和最佳实践"
    icon="sparkles"
  >}}
  {{< hextra/feature-card
    title="🚀 项目展示"
    subtitle="展示个人项目、开源作品和技术实践"
    icon="cube"
  >}}
  {{< hextra/feature-card
    title="🎨 主题定制"
    subtitle="使用 Hextra 主题，支持暗色模式和响应式设计"
    icon="adjustments"
  >}}
  {{< hextra/feature-card
    title="🔍 快速搜索"
    subtitle="内置全文搜索功能，快速找到你需要的内容"
    icon="search"
  >}}
{{< /hextra/feature-grid >}}
