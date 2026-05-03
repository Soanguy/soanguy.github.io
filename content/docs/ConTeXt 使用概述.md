---
title: ConTeXt 使用概述
weight: 2
slug: context-overview
---

如果你想使用 ConTeXt 编写一本书，这本书中包括封面、目录、序章、正文、附录等一系列内容。那么，我们可以创建如下文件，然后在透过 ConTeXt 做进一步处理。

`newbook.tex`
```
\starttext
\startfrontmatter
  \completecontent
\stopfrontmatter
\startbodymatter
  \startchapter[title={chapter 1}]
    some words
    \startsection[title={section 1}]
      some words \emph{some words}
    \stopsection
  \stopchapter
\stopbodymatter
\startappendices
  \startchapter[title={chapter 1}]
    some words
    \startsection[title={section 1}]
      some words
    \stopsection
  \stopchapter
\stopappendices
\stoptext
```

ConTeXt 中大部分的命令结构基本上都可以在上面的样例中找到。

例如，你想设置一个标题

`\startchapter[title={chapter 1}] \stopchapter`

- 命令都是以 `\` 开始
- 命令的内容可以通过 `[]` 或者 `{}` 进行设置。
    - `[]` 中设置的大多是 key-value 参数，它们基本上以 `key=value` 的方式设置。例如上例中，显而易见地，是设置 chapter 的标题内容为 chapter 1。
    -  `{}` 中是直接的参数。上述命令有一个间断的形式：`\chapter{chapter 1}`。此处就是直接设置 `\chapter` 的标题内容。`{}` 标记了该命令的起始和结束。
了解了这些，我们可以推测出其他的命令的含义（大部分情况下都可以直接通过命令名称推测出命令的用法）。

```
\starttext % 开始文章
\startfrontmatter % 开始序章部分
  \completecontent % 启用完整的目录
\stopfrontmatter % 结束序章部分
\startbodymatter % 开始正文部分
  \startchapter[title={chapter 1}] %开始一级标题
    some words % 正文
    \startsection[title={section 1}] % 开始二级标题
      some words 
      \emph{some words} % 强调某些文字
    \stopsection % 结束二级标题
  \stopchapter % 结束一级标题
\stopbodymatter % 结束正文部分
\startappendices % 开始附录部分
  \startchapter[title={chapter 1}]
    some words
    \startsection[title={section 1}]
      some words
    \stopsection
  \stopchapter
\stopappendices % 结束附录部分
\stoptext % 结束文章
```

大部分 ConTeXt 命令的形式如下

| 命令             | 示例                                   |
| -------------- | --------------------------------------- |
| \Command       | \TeX                                    |
| \Commnad{}     | \section{}                              |
| \Command\[\]   | \in\[fig:context\]                      |
| \Command\[\]{} | \subsection\[subsection\]{subsection 1} |
| \Command{}\[\] | \at{page}\[fig:context\]                |
