---
title: 自动载入 typescriptfile 而不必手动指定
tags:
  - 字体
  - 打字稿
  - typescriptfile
---

用户自定义的 typescript 想要激活的话，需要通过

```
\usetypescriptfile[your typescript file name]
\setupbodyfont[font name you want]
```

但是，每次都需要显示指定需要载入的 typescriptfile 过于麻烦。ConTeXt 设定了 `\definefilesynonym` 命令来快速的链接 typesctiptfile 和 fontname。
例如，我们在 `type-imp-source` 中设定了 sourcehansc、sourcehantc、sourcehanjp 等一系列的 typesctipt 。那么，我们可以

```
\definefilesynonym [type-imp-sourcesc.mkiv] [type-imp-source.mkiv]
\definefilesynonym [type-imp-sourcetc.mkiv] [type-imp-source.mkiv]
\definefilesynonym [type-imp-sourcejp.mkiv] [type-imp-source.mkiv]
```

这样，就可以直接使用 `\setupbodyfont[sourcesc]` 来直接激活该打字稿，无须通过 `\usetypescriptfile` 显示指定。