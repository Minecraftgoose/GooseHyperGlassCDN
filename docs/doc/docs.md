# GooseHyperGlassCDN2.5 — 接入文档

> 纯 WebGL 渲染的液态玻璃 UI 组件。一个 `<script>` 标签完事，零依赖。
> 自定义元素 `<liquid-glass>`，你写 HTML 它就画 WebGL。
>
> **GooseHyperGlassCDN2.5**

> **上游项目**
>
> - 原项目：[Kyant0/AndroidLiquidGlass](https://github.com/Kyant0/AndroidLiquidGlass)（Android）
> - WebGL 移植版：[martin65536/liquid-glass-webgl](https://github.com/martin65536/liquid-glass-webgl)
> - Siri 动画与搜索框：[aaaa-zhen/siri-glsl](https://github.com/aaaa-zhen/siri-glsl)（MIT）—— 本文档第 16 节 `siri-wave` 与第 17 节 `liquid-glass-search` 均移植自该项目

> **AI 阅读说明**
>
> 本文档内容已直接内嵌于 HTML 中，不依赖 JavaScript 渲染，理论上任何能抓取网页的工具均可直接阅读。但实测发现，部分 AI 的网页浏览能力受限于底层浏览器环境，无法正确获取本文档内容——如 DeepSeek、智谱清言 等仅支持基础网页访问的模型。
>
> 推荐使用具备完整网页解析能力的 AI 助手阅读：
> **豆包（Doubao-Seed-2.1-Turbo）** · **元宝任务** · **Kimi 系列** · **OpenClaw** · **Agent 类工具**
>
> <a href="./docs.md" class="ai-compat-link" download>下载本文档原文（Markdown）</a>

---

## 目录

- [1. 安装](#install)
- [2. 第一个组件（60 秒上手）](#quickstart)
- [3. 所有属性速查表](#attributes)
- [4. 所有 mode 速查表](#modes)
- [5. 壁纸](#wallpaper)
- [6. JS API 一览](#js-api)
- [7. 所有事件一览](#events)
- [8. 开关 toggle](#toggle)
- [9. 滑块 slider](#slider)
- [10. 底部标签栏 bottom-tabs](#bottom-tabs)
- [11. 按钮组 buttons](#buttons)
- [12. 弹窗 dialog](#dialog)
- [13. 滚动容器 scroll-container](#scroll)
- [14. 评分 rating](#rating)
- [15. 圆环进度 ring-progress](#ring-progress)
- [16. Siri 声波 siri-wave](#siri-wave)
- [17. 拖拽唤醒搜索框 liquid-glass-search](#search)
- [18. 主题](#theme)
- [19. 渲染参数调优](#render)
- [20. SVG 图标速查表](#icons)
- [21. 常见报错与排查](#troubleshooting)
- [22. 页面架构建议](#architecture)

---

## 1. 安装 {#install}

在你的 HTML 文件 `<head>` 或 `<body>` 中加一行：

```html
<script src="https://glass.goose.gs.cn/liquid-glass.js"></script>
```

**就这一行。** 没有 `npm install`、没有 `webpack`、没有 `node_modules`。
这个 JS 文件约 345KB（gzip 后约 95KB），注册了一个叫 `<liquid-glass>` 的自定义 HTML 标签。

之后你就可以像用 `<div>` 一样用 `<liquid-glass>` 了。

---

## 2. 第一个组件（60 秒上手） {#quickstart}

把下面整段保存为 `demo.html`，双击浏览器打开：

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>liquid-glass demo</title></head>
<body style="margin:0;background:#0a0e17;display:flex;justify-content:center;padding:60px 0">

  <!-- 第 1 步：引入 JS -->
  <script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

  <!-- 第 2 步：写标签，设宽高 -->
  <liquid-glass mode="toggle"
    style="width:380px;height:240px;border-radius:28px;overflow:hidden">
  </liquid-glass>

</body>
</html>
```

**打开后你会看到什么：** 一个深色背景上的液态玻璃开关。开关有半透明玻璃质感，手指拖动能看到"折射"效果（玻璃下面的壁纸被扭曲）。

**为什么必须设宽高？** `<liquid-glass>` 内部是 WebGL Canvas。Canvas 没有 CSS 宽高就不会渲染。给父容器设宽高（或直接用 `style="width:...;height:..."` 写在标签上）。

**关键点：`mode` 属性决定画什么。** 下面你会看到每种 mode 的完整示例。

---

## 3. 所有属性速查表 {#attributes}

`<liquid-glass>` 标签支持的 HTML 属性：

| 属性 | 值类型 | 默认值 | 作用 |
|------|--------|--------|------|
| `mode` | 字符串 | `"bottom-tabs"` | 组件类型。取值见[第 4 节](#modes) |
| `dark` | 布尔属性（写了就生效） | 不写 = 浅色 | 深色主题：卡片变黑底、文字变白 |
| `wallpaper` | URL 字符串 或 `"gradient"` | 透明（无壁纸） | 玻璃的"背景内容"。不传默认透明，`"gradient"` 恢复渐变。见[第 5 节](#wallpaper) |
| `dpr` | 数字字符串 | 上限 1.5 | 渲染分辨率上限。`"2"` 表示最高 2x。**不写默认 cap 在 1.5**（性能底线），想要玻璃折射/高光/内阴影全高清，显式传设备 DPR：`dpr="2"` 或 `String(window.devicePixelRatio)` |
| `corner-style` | `"0"` `"1"` `"2"` | `"1"`（圆角） | 容器圆角风格 |
| `blur-tap-cap` | 数字字符串 | `"17"` | 触屏模糊强度上限（1-33） |
| `overlay-buttons` | 布尔属性 | 不写 | 显示右上角返回 + 主题切换按钮 |

**注意事项：**
- `dark` 没有值，写了就生效：`<liquid-glass dark>`。不用写 `dark="true"`。
- `overlay-buttons` 同理：`<liquid-glass overlay-buttons>`。
- `tabs` / `buttons` / `dialog` / `scroll` 这四个属性虽然存在，但**不要用**。用 [JS API](#js-api) 代替，原因见[第 21 节第 4 条](#troubleshooting)。

---

## 4. 所有 mode 速查表 {#modes}

| mode 字符串 | 画什么 | 视觉描述 | 推荐容器高度 |
|------------|--------|----------|-------------|
| `toggle` | 开关 × 2 | 上下两个开关：上面透明折射壁纸，下面白色胶囊里一个 | 280px |
| `single-toggle` | 开关 × 1 | 只有上面那个透明开关 | 200px |
| `toggle-card` | 开关 × 1 | 只有白色胶囊里那个开关 | 200px |
| `slider` | 滑块 × 2 | 上下两个滑块：上面透明，下面白色胶囊里 | 280px |
| `single-slider` | 滑块 × 1 | 只有上面那个透明滑块 | 200px |
| `slider-card` | 滑块 × 1 | 只有白色胶囊里那个滑块 | 200px |
| `bottom-tabs` | 标签栏 × 2 | 上下两排：3tab + 4tab | 260px |
| `single-bottom-tabs` | 标签栏 × 1 | 只第一排（3 个 tab） | 120px |
| `bottom-tabs-2` | 标签栏 × 1 | 只第二排（4 个 tab） | 120px |
| `buttons` | 按钮列表 | 默认 4 个英文按钮，用 `setButtons` 自定义 | 按按钮数 × 80px |
| `dialog` | 弹窗 | 标题 + 正文 + 取消/确定 | 280px |
| `scroll-container` | 滚动卡片列表 | 多张玻璃卡片，可手指滑动 | 500px |
| `lazy-scroll-container` | 滚动卡片列表（大） | 100 张卡片 | 500px |
| `rating` | 星级评分 | 5 颗玻璃星星，点击评分 | 200px |
| `ring-progress` | 圆环进度 | 玻璃圆环，可显示进度百分比 | 200px |
| `siri-wave` | Siri 声波动画 | 全屏 fragment shader 动画：声波 / 流体圆点（`variant` 切换） | 260px+ |

**"双份" vs "单份"是什么意思？**

- "双份" = 组件在**同一画布**里画了两遍。上面是"透明背景版"（玻璃直接折射壁纸），下面是"白卡版"（有白色胶囊底板）。比如 `toggle` 画两个开关上下排列。
- "单份" = 只画其中一份。比如 `single-toggle` 只画透明版，`toggle-card` 只画白卡版。

**选哪个？** 大多数场景，直接用"单份"（`single-toggle` / `single-slider` / `single-bottom-tabs`）即可。"双份"主要用于对比展示。

---

## 5. 壁纸 {#wallpaper}

壁纸是玻璃折射的"背景内容"——玻璃组件画在壁纸上面，玻璃 blur 效果会让壁纸看起来像磨砂玻璃后面的画面。

### 四种壁纸方式

**方式一：不传，默认透明**

```html
<liquid-glass mode="toggle" style="width:380px;height:200px"></liquid-glass>
```

默认无壁纸，画布透明——玻璃直接叠加在父容器的 CSS 背景上。**优点：零配置，直接用父容器背景。**

**方式二：传图片 URL**

```html
<liquid-glass mode="toggle"
  wallpaper="https://你的图片URL/bg.jpg"
  style="width:380px;height:200px">
</liquid-glass>
```

图片按 `background-size: cover` 居中裁剪铺满画布——任意尺寸都行。

**方式三：传 data: URL**

```html
<liquid-glass mode="toggle"
  wallpaper="data:image/jpeg;base64,/9j/4AAQ..."
  style="width:380px;height:200px">
</liquid-glass>
```

不走网络请求，适合内联壁纸。文件约 800KB（base64 后约 1MB）。

**方式四：显式用渐变（保留原默认效果）**

```html
<liquid-glass mode="toggle" wallpaper="gradient"></liquid-glass>
```

如果不传 `wallpaper` 属性，默认是**透明背景**。设 `wallpaper="gradient"` 可恢复到旧版深蓝 → 深灰渐变效果。

### CORS 警告

组件内部用 `img.crossOrigin = 'anonymous'` 加载壁纸图片。如果你的图片 URL 是**跨域**的，服务器必须返回 HTTP 头：

```
Access-Control-Allow-Origin: *
```

**没有这个头 → 图片加载失败 → 玻璃后面一片黑。** 控制台会打印 `[liquid-glass] wallpaper load failed`。

**怎么办：**
- 图片放**同域**（跟你的 HTML 同域名）→ 无 CORS 问题
- 或用 **Cloudflare R2**（自带 CORS 头）
- 或直接用 `data:` URL（但文件较大，800KB 左右）

### 多个 liquid-glass 共享壁纸

如果你页面有多个 `<liquid-glass>`，每个都要设 `wallpaper`。不想重复写？存到变量里：

```html
<script>
  var WP = 'data:image/jpeg;base64,/9j/4AAQ...'; // 壁纸 data URL
</script>
<liquid-glass mode="toggle" id="a"></liquid-glass>
<liquid-glass mode="slider" id="b"></liquid-glass>
<script>
  document.getElementById('a').setAttribute('wallpaper', WP);
  document.getElementById('b').setAttribute('wallpaper', WP);
</script>
```

---

## 6. JS API 一览 {#js-api}

**强烈建议用 JS API 代替 HTML attribute 传入配置数据。** 原因见[第 21 节第 4 条](#troubleshooting)。

以下 5 个方法挂在 `<liquid-glass>` 元素实例上：

### `el.setTabs(config)`

设置底部标签栏 tab 配置。

- **参数类型：** `Array<Array<{icon?, label?, viewport?}>>` （二维数组，外层每一行 tab）
- **何时调用：** 在元素插入 DOM 后，`requestAnimationFrame` 内

```js
var el = document.getElementById('my-tabs');
requestAnimationFrame(function() {
  el.setTabs([
    // 第一行 3 个 tab
    [
      { icon: 'M10 20v-6h4v6...', label: '首页', viewport: 24 },
      { icon: 'M15.5 14h-.79...', label: '发现', viewport: 24 },
      { icon: 'M12 21.35l-...',    label: '收藏', viewport: 24 }
    ],
    // 第二行 4 个 tab（可选，仅 bottom-tabs 双份模式用得到）
    [
      { icon: 'M10 20v-6h4v6...', label: '首页', viewport: 24 },
      { icon: 'M15.5 14h-.79...', label: '发现', viewport: 24 },
      { icon: 'M12 21.35l-...',    label: '收藏', viewport: 24 },
      { icon: 'M12 12a5 5...',     label: '我的', viewport: 24 }
    ]
  ]);
});
```

**谁用哪一行？**

| mode | 读 config 的哪个下标 |
|------|---------------------|
| `single-bottom-tabs` | `config[0]`（第一行） |
| `bottom-tabs-2` | `config[1]`（第二行） |
| `bottom-tabs`（双份） | 两行都用 |

**字段说明：**

| 字段 | 必填 | 类型 | 默认 | 说明 |
|------|------|------|------|------|
| `icon` | 否 | string | 飞机图标 path | SVG `<path d="...">` 的 d 值 |
| `label` | 否 | string | `"Tab 1"` / `"Tab 2"` ... | tab 下方文字 |
| `viewport` | **强烈建议** | number | `960` | path 的坐标范围。Material Icons 填 **24** |

`viewport` 的坑：默认 960 是飞行图标用的坐标范围。如果你用 Material Design icons（坐标范围 0-24），不传 viewport 会导致图标缩放为 `24/960 = 2.5%`，肉眼看不见。SVG path 图库见[第 20 节](#icons)。

### `el.setButtons(config)`

设置按钮组。

- **参数类型：** `Array<{id?, label?, style?}>`
- **style 预设：** `transparent` / `surface` / `blue` / `orange` / `red` / `green` / `purple`
- **style 自定义：** `[r, g, b, a]` RGBA 数组（0-1）

```js
el.setButtons([
  { id: 't', label: '透明', style: 'transparent' },
  { id: 's', label: '表面', style: 'surface' },
  { id: 'b', label: '蓝色', style: 'blue' },
  { id: 'c', label: '自定义紫', style: [0.6, 0.2, 1, 0.8] }
]);
```

### `el.setDialog(config)`

设置弹窗文案。

- **参数类型：** `{title?, body?, cancelText?, okayText?}`

```js
el.setDialog({
  title: '提示',
  body: '这是一条通知消息。',
  cancelText: '取消',
  okayText: '确定'
});
```

### `el.setScroll(config)`

设置滚动容器卡片列表。

- **参数类型：** `Array<{title, subtitle?, link?}>`
- `link` 是 `{text, href?}`

```js
el.setScroll([
  { title: '标题', subtitle: '副标题', link: { text: '查看', href: 'https://...' } },
  { title: '只有标题' }
]);
```

### `el.setState(patch)`

直接设置组件内部状态（合并式更新），改完自动重渲染。用来自定义评分、进度等组件的值。

- **参数类型：** `Object`（浅合并到当前状态）

```js
// 把评分设为 3 颗星（再点同分可清零是组件的交互逻辑，setState 不参与）
el.setState({ ratingValue: 3 });
```

**常用状态字段：**

| 字段 | 组件 | 类型 | 说明 |
|------|------|------|------|
| `ratingValue` | `rating` | number | 当前评分（0-5） |
| `scrollY` | `scroll-container` | number | 滚动偏移量（px） |

> 其他组件的内部状态字段属于实现细节，不建议外部直接改。只读状态请监听事件（见[第 7 节](#events)）。

---

## 7. 所有事件一览 {#events}

所有事件都是 `CustomEvent`，`bubbles: true`（冒泡到 document）。

| 事件名 | `event.detail` 内容 | 何时触发 |
|--------|---------------------|----------|
| `lg-statechange` | `{toggleOn, sliderValue, selectedTab, selectedTab2, ratingValue, dark, hideOverlayButtons, globalSeparableBlur}` | 用户拖拽开关/滑块/点击 tab/点击星星时 |
| `lg-buttontap` | `{id}` | 按钮被点击，id 是 `setButtons` 传的 id |
| `lg-dialogtap` | `{action: "cancel"` 或 `"okay"}` | 弹窗取消/确定被点击 |
| `lg-linktap` | `{index, href}` | 滚动容器卡片链接被点击 |
| `lg-navigate` | `{dest, name}` | 内部导航（暂未用到） |
| `lg-back` | 无 detail | overlay-buttons 的返回按钮被点 |

**监听示例：**

```js
document.addEventListener('lg-statechange', function(e) {
  console.log('toggleOn:', e.detail.toggleOn);       // true/false
  console.log('sliderValue:', e.detail.sliderValue); // 0-100
  console.log('selectedTab:', e.detail.selectedTab); // 0/1/2（第一排，single-bottom-tabs / bottom-tabs 用）
  console.log('selectedTab2:', e.detail.selectedTab2);// 0/1/2/3（第二排，bottom-tabs-2 / bottom-tabs 用）
  console.log('dark:', e.detail.dark);               // true/false
});

document.addEventListener('lg-buttontap', function(e) {
  console.log('点击按钮:', e.detail.id);
});

document.addEventListener('lg-dialogtap', function(e) {
  console.log('弹窗操作:', e.detail.action); // "cancel" 或 "okay"
});

document.addEventListener('lg-linktap', function(e) {
  console.log('链接点击: 第', e.detail.index, '个卡片, href=', e.detail.href);
});
```

---

## 8. 开关 toggle {#toggle}

### 完整可运行示例

保存为 `toggle.html`，双击打开：

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>开关 toggle</title></head>
<body style="margin:0;background:#0a0e17;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:24px;font-family:sans-serif">

  <script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

  <!-- 单份透明版 = 开关折射壁纸 -->
  <div style="color:#9fb3c8;font-size:13px">单份透明版（mode=single-toggle）</div>
  <liquid-glass mode="single-toggle"
    style="width:380px;height:200px;border-radius:28px;overflow:hidden">
  </liquid-glass>

  <!-- 单份白卡版 = 白色胶囊底板里的开关 -->
  <div style="color:#9fb3c8;font-size:13px;margin-top:12px">单份白卡版（mode=toggle-card）</div>
  <liquid-glass mode="toggle-card"
    style="width:380px;height:200px;border-radius:28px;overflow:hidden">
  </liquid-glass>

  <!-- 状态显示 -->
  <div id="status" style="color:#6fc0ec;font-size:14px">开关状态：-</div>

  <script>
    document.addEventListener('lg-statechange', function(e) {
      document.getElementById('status').textContent =
        '开关状态：' + (e.detail.toggleOn ? '开' : '关');
    });
  </script>

</body>
</html>
```

### 每个 mode 解释

| mode | 画什么 | 推荐高度 | 何时用 |
|------|--------|---------|--------|
| `single-toggle` | 1 个透明玻璃开关，折射壁纸 | 200px | 做 iOS 风格设置页开关 |
| `toggle-card` | 1 个白色胶囊卡片里的开关 | 200px | 做 Material Design 风格开关 |
| `toggle` | 上面透明 + 下面白卡，上下排列 | 280px | 对比展示/调试 |

### 状态读取

```js
document.addEventListener('lg-statechange', function(e) {
  var isOn = e.detail.toggleOn;
  // true = 开关开了, false = 关了
});
```

### 两个开关联动

`toggle`（双份）模式下，两个开关是**联动的**——拖上面，下面的跟着动。它们共享同一个状态 `toggleOn`。

---

## 9. 滑块 slider {#slider}

保存为 `slider.html`：

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>滑块 slider</title></head>
<body style="margin:0;background:#0a0e17;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:24px;font-family:sans-serif">

  <script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

  <div style="color:#9fb3c8;font-size:13px">单份透明版（mode=single-slider）</div>
  <liquid-glass mode="single-slider"
    style="width:380px;height:200px;border-radius:28px;overflow:hidden">
  </liquid-glass>

  <div style="color:#9fb3c8;font-size:13px;margin-top:12px">单份白卡版（mode=slider-card）</div>
  <liquid-glass mode="slider-card"
    style="width:380px;height:200px;border-radius:28px;overflow:hidden">
  </liquid-glass>

  <div id="val" style="color:#6fc0ec;font-size:14px">滑块值：-</div>

  <script>
    document.addEventListener('lg-statechange', function(e) {
      var v = e.detail.sliderValue;
      if (v !== undefined) {
        document.getElementById('val').textContent = '滑块值：' + v + ' / 100';
      }
    });
  </script>

</body>
</html>
```

| mode | 推荐高度 |
|------|---------|
| `single-slider` | 200px |
| `slider-card` | 200px |
| `slider`（双份） | 280px |

---

## 10. 底部标签栏 bottom-tabs {#bottom-tabs}

### 完整可运行示例 — 单排 3 tab

保存为 `tabs.html`：

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>底部标签栏</title></head>
<body style="margin:0;background:#0a0e17;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:16px;font-family:sans-serif">

  <script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

  <div style="color:#9fb3c8;font-size:13px">透明版（3 tab）</div>
  <liquid-glass id="tabs1" mode="single-bottom-tabs"
    style="width:380px;height:120px;border-radius:24px;overflow:hidden">
  </liquid-glass>

  <div style="color:#9fb3c8;font-size:13px;margin-top:12px">白卡风（4 tab）</div>
  <liquid-glass id="tabs2" mode="bottom-tabs-2"
    style="width:380px;height:120px;border-radius:24px;overflow:hidden">
  </liquid-glass>

  <div id="tab-info" style="color:#6fc0ec;font-size:14px">选中的 tab：-</div>

  <script>
    // 3 tab 版：传一行
    requestAnimationFrame(function() {
      document.getElementById('tabs1').setTabs([[
        { icon:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', label:'首页', viewport:24 },
        { icon:'M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z', label:'发现', viewport:24 },
        { icon:'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', label:'收藏', viewport:24 }
      ]]);

      // bottom-tabs-2 读 tabsConfig[1]（第二行），所以传二维数组
      document.getElementById('tabs2').setTabs([
        [], // 第一行留空
        [
        { icon:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', label:'首页', viewport:24 },
        { icon:'M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z', label:'发现', viewport:24 },
        { icon:'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', label:'收藏', viewport:24 },
        { icon:'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z', label:'我的', viewport:24 }
      ]]);
    });

    document.addEventListener('lg-statechange', function(e) {
      document.getElementById('tab-info').textContent =
        '选中：tab[' + e.detail.selectedTab + ']';
    });
  </script>

</body>
</html>
```

### mode 和 config 对应关系

| mode | 用 config 的哪行 | 典型 tab 数 |
|------|-----------------|------------|
| `single-bottom-tabs` | `config[0]` | 3 |
| `bottom-tabs-2` | `config[1]` | 4 |
| `bottom-tabs` | 两行都用 | 3 + 4 |

### 图标尺寸

每个 tab 的图标渲染在 **24×24 像素**区域内，上方是图标、下方是 12px 文字。图标 SVG path 的坐标范围用 `viewport` 指定——Material Icons 填 `24`。

---

## 11. 按钮组 buttons {#buttons}

保存为 `buttons.html`：

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>按钮组</title></head>
<body style="margin:0;background:#0a0e17;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:16px;font-family:sans-serif">

  <script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

  <!-- 方式一：4 个按钮在同一个 frame 里（组件内部垂直排列） -->
  <div style="color:#9fb3c8;font-size:13px">4 个按钮一组</div>
  <liquid-glass id="btns-all" mode="buttons"
    style="width:380px;height:400px;border-radius:28px;overflow:hidden">
  </liquid-glass>

  <div id="btn-log" style="color:#6fc0ec;font-size:14px">点击日志：-</div>

  <script>
    requestAnimationFrame(function() {
      document.getElementById('btns-all').setButtons([
        { id: 't', label: '透明', style: 'transparent' },
        { id: 's', label: '表面', style: 'surface' },
        { id: 'b', label: '蓝色', style: 'blue' },
        { id: 'o', label: '橙色', style: 'orange' }
      ]);
    });

    document.addEventListener('lg-buttontap', function(e) {
      document.getElementById('btn-log').textContent =
        '点击了：' + e.detail.id;
    });
  </script>

</body>
</html>
```

### style 预设色

| 名称 | tint 色 | 表面色 | 文字色 |
|------|---------|--------|--------|
| `transparent` | 透明 | 透明 | 黑 |
| `surface` | 透明 | 白 30% | 黑 |
| `blue` | #0088FF | 透明 | 白 |
| `orange` | #FF8D28 | 透明 | 白 |
| `red` | #FF4D4F | 透明 | 白 |
| `green` | #34C74B | 透明 | 白 |
| `purple` | #9C27B0 | 透明 | 白 |

### 自定义颜色

```js
{ id: 'c', label: '自定义', style: [0.2, 0.5, 1, 0.8] }
//                                R    G    B   A  (0-1)
```

### 每个按钮单独 frame

如果你想每个按钮独立放在不同容器里（而不是组件内部自动排列），创建多个 `<liquid-glass>`：

```html
<div id="btns-row" style="display:flex;flex-direction:column;gap:12px;align-items:center"></div>
<script>
  var configs = [
    { label:'透明', style:'transparent' },
    { label:'表面', style:'surface' },
    { label:'蓝色', style:'blue' },
    { label:'橙色', style:'orange' }
  ];
  var container = document.getElementById('btns-row');
  configs.forEach(function(c, i) {
    var frame = document.createElement('div');
    frame.style.cssText = 'width:240px;height:96px;border-radius:20px;overflow:hidden;background:#0a0e17';
    var el = document.createElement('liquid-glass');
    el.setAttribute('mode', 'buttons');
    el.style.cssText = 'width:100%;height:100%';
    frame.appendChild(el);
    container.appendChild(frame);
    requestAnimationFrame(function() {
      el.setButtons([{ id: 'btn'+i, label: c.label, style: c.style }]);
    });
  });
</script>
```

---

## 12. 弹窗 dialog {#dialog}

保存为 `dialog.html`：

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>弹窗</title></head>
<body style="margin:0;background:#0a0e17;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:16px;font-family:sans-serif">

  <script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

  <div style="color:#9fb3c8;font-size:13px">弹窗示例（点击按钮不关闭）</div>
  <liquid-glass id="dlg" mode="dialog"
    style="width:380px;height:280px;border-radius:28px;overflow:hidden">
  </liquid-glass>

  <div id="dlg-log" style="color:#6fc0ec;font-size:14px">-</div>

  <script>
    var dlg = document.getElementById('dlg');
    requestAnimationFrame(function() {
      dlg.setDialog({
        title: '删除确认',
        body: '此操作不可撤销，确定要删除吗？',
        cancelText: '取消',
        okayText: '确认删除'
      });
    });

    // 监听点击
    document.addEventListener('lg-dialogtap', function(e) {
      document.getElementById('dlg-log').textContent =
        '点击了：' + e.detail.action;
    });

    // 阻止自动关闭：用 MutationObserver 在 mode 被改走后瞬间改回来
    new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.type === 'attributes' && m.attributeName === 'mode') {
          if (m.target.getAttribute('mode') !== 'dialog') {
            requestAnimationFrame(function() {
              m.target.setAttribute('mode', 'dialog');
            });
          }
        }
      });
    }).observe(document.body, {
      attributes: true, subtree: true, attributeFilter: ['mode']
    });
  </script>

</body>
</html>
```

**为什么需要 MutationObserver？** 弹窗的取消/确定按钮被点击后，组件**内部硬编码**了关闭行为：`this.setAttribute('mode', prevMode)` 切回进入 dialog 之前的视图。`e.preventDefault()` 对 `CustomEvent` 无效。MutationObserver 在 mode 被改走的瞬间拦截并恢复。

**如果你想要正常的关闭行为**（点了就关），删掉 MutationObserver 那段即可。

---

## 13. 滚动容器 scroll-container {#scroll}

保存为 `scroll.html`：

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>滚动容器</title></head>
<body style="margin:0;background:#0a0e17;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:16px;font-family:sans-serif">

  <script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

  <div style="color:#9fb3c8;font-size:13px">滚动容器（手指滑动）</div>
  <liquid-glass id="sc" mode="scroll-container"
    style="width:380px;height:500px;border-radius:28px;overflow:hidden">
  </liquid-glass>

  <div id="sc-log" style="color:#6fc0ec;font-size:14px">-</div>

  <script>
    var sc = document.getElementById('sc');
    requestAnimationFrame(function() {
      sc.setScroll([
        { title: '天气预报', subtitle: '2026-07-22', link: { text: '查看详情', href: '#' } },
        { title: '系统通知', subtitle: '2026-07-21' },
        { title: '活动提醒', subtitle: '2026-07-20', link: { text: '立即参与', href: '#' } },
        { title: '版本更新', subtitle: 'v2.3.0' },
        { title: '账户安全', subtitle: '2026-07-18', link: { text: '查看', href: '#' } },
        { title: '优惠券到账', subtitle: '2026-07-17' },
        { title: '订单发货', subtitle: '2026-07-16', link: { text: '追踪物流', href: '#' } }
      ]);
    });

    document.addEventListener('lg-linktap', function(e) {
      document.getElementById('sc-log').textContent =
        '点击链接：第 ' + e.detail.index + ' 个卡片 → ' + e.detail.href;
    });
  </script>

</body>
</html>
```

**注意：mode 是 `"scroll-container"`，不是 `"scroll"`。** 写错了会渲染成默认的底部标签栏视图。

---

## 14. 评分 rating {#rating}

5 颗星星横向排列，每颗都是独立的液态玻璃按钮。点第 N 颗设评分为 N（1-5），再点同一颗归零。

保存为 `rating.html`：

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>评分 rating</title></head>
<body style="margin:0;background:#0a0e17;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:16px;font-family:sans-serif">

  <script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

  <div style="color:#9fb3c8;font-size:13px">星级评分（点星星试试）</div>
  <liquid-glass id="rt" mode="rating"
    style="width:380px;height:200px;border-radius:28px;overflow:hidden">
  </liquid-glass>

  <div id="rt-log" style="color:#6fc0ec;font-size:14px">评分：0 星</div>

  <script>
    document.addEventListener('lg-statechange', function(e) {
      var v = e.detail.ratingValue;
      if (v !== undefined) {
        document.getElementById('rt-log').textContent = '评分：' + v + ' 星';
      }
    });
  </script>

</body>
</html>
```

### 交互逻辑

| 操作 | 效果 |
|------|------|
| 点第 N 颗星 | 评分设为 N（1-5） |
| 再点当前已选的那颗 | 评分归零（0） |
| 点第 N 颗时当前评分 > N | 评分改为 N（不是归零） |

### 状态读取

评分值通过 `lg-statechange` 事件的 `detail.ratingValue` 读取，范围 0-5。

```js
document.addEventListener('lg-statechange', function(e) {
  console.log('当前评分:', e.detail.ratingValue); // 0-5
});
```

### 视觉细节

- 已选星星：金色图标 + 金色玻璃底色
- 未选星星：灰色图标 + 透明玻璃底色
- 星星尺寸 36px，间距 12px，居中排列
- 支持深浅主题（`dark` 属性），金色在两种主题下都好看

---

## 15. 圆环进度 ring-progress {#ring-progress}

圆形玻璃圆环进度条，带实时百分比文字。点击左半边减 10%，右半边加 10%。

保存为 `ring-progress.html`：

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>圆环进度 ring-progress</title></head>
<body style="margin:0;background:#0a0e17;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:16px;font-family:sans-serif">

  <script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

  <div style="color:#9fb3c8;font-size:13px">圆环进度（点击左右调值）</div>
  <liquid-glass id="rp" mode="ring-progress"
    style="width:380px;height:280px;border-radius:28px;overflow:hidden">
  </liquid-glass>

  <div id="rp-log" style="color:#6fc0ec;font-size:14px">进度：50%</div>

  <script>
    document.addEventListener('lg-statechange', function(e) {
      var v = e.detail.ringProgressValue;
      if (v !== undefined) {
        document.getElementById('rp-log').textContent = '进度：' + v + '%';
      }
    });
  </script>

</body>
</html>
```

### 交互逻辑

| 操作 | 效果 |
|------|------|
| 点击左半边 | 进度减 10%（最低 0%） |
| 点击右半边 | 进度加 10%（最高 100%） |

### 状态读取

进度值通过 `lg-statechange` 事件的 `detail.ringProgressValue` 读取，范围 0-100。

```js
document.addEventListener('lg-statechange', function(e) {
  console.log('当前进度:', e.detail.ringProgressValue); // 0-100
});
```

### 视觉细节

- 灰色圆环轨道（背景环）+ 蓝色填充弧（进度环）
- 正中间显示当前百分比文字（36px 粗体）
- 半透明玻璃圆形底板
- 初始值 50%

---

## 16. Siri 声波 siri-wave {#siri-wave}

纯 fragment shader 动画 mode——Apple 新版 Siri 声波与流体圆点复刻（移植自 [aaaa-zhen/siri-glsl](https://github.com/aaaa-zhen/siri-glsl)，MIT）。它不像其他 mode 画玻璃元素，而是在整个组件画布上跑 shader 动画，线条自带透明背景，可叠在任何壁纸/背景上。

### 基本用法

```html
<liquid-glass mode="siri-wave" style="width:640px;height:260px"></liquid-glass>
```

### 变体（variant）

| variant | 动画 | 说明 |
|---------|------|------|
| `wave`（默认） | Siri 声波 | 光谱色散 + Lorentzian 发光线，多色声波上下波动 |
| `orb` | 流体圆点 | 6 个 metaball 圆点做欠阻尼弹簧运动，周期聚合/爆发 |

```html
<liquid-glass mode="siri-wave" variant="orb" style="width:640px;height:260px"></liquid-glass>
```

### 参数属性

| 属性 | 默认 | 说明 |
|------|------|------|
| `speed` | `1` | 动画速度倍率（>0） |
| `scale` | `1` | 动画整体大小倍率（>0） |

```html
<liquid-glass mode="siri-wave" variant="orb" speed="1.5" scale="0.8" style="width:640px;height:260px"></liquid-glass>
```

### JS 控制

```js
var el = document.querySelector('liquid-glass[mode="siri-wave"]');
el.setState({ variant: 'orb' }); // 切到流体圆点
el.setState({ speed: 2 });       // 加速
```

也可用 `setAttribute`：`el.setAttribute('variant', 'wave')`。

### 注意事项

- `dark` / `wallpaper` / `theme-button` 等玻璃属性对 siri-wave **无效**（动画自带颜色，背景透明）
- 内部分辨率为容器尺寸 × dpr × 0.75，性能差时给 `dpr="1"` 可降低负载
- 同一页面多个 siri-wave 组件各自独立动画，互不影响

---


---

## 17. 拖拽唤醒搜索框 liquid-glass-search {#search}

独立组件（**不是 mode**），复刻 iPadOS 从顶部黑边往下拖拽唤醒搜索（移植自 [aaaa-zhen/siri-glsl](https://github.com/aaaa-zhen/siri-glsl)，MIT，QuartzCore SDF 管线反汇编）。它走独立的 WebGL2 渲染通道，与 `<liquid-glass>` 主组件互不干扰，但同一个 `liquid-glass.js` 文件里注册——引入一个 script 两个元素都能用。

### 基本用法

```html
<liquid-glass-search style="width:100%;height:300px"></liquid-glass-search>
```

从顶部黑边往下拖 → 液滴渗出（梯度感知融合液颈）→ 拉过半屏松手 → 弹簧形变成搜索胶囊；点空白处或按 Esc 收回。搜索框内部是真实 input，可以直接打字。

### 属性

| 属性 | 默认 | 说明 |
|------|------|------|
| `wallpaper` | 无（程序化背景） | 背景图 URL，玻璃会折射它；不传则 shader 内置的地图风格背景 |
| `placeholder` | `Search or Ask` | 搜索框提示文字 |
| `hint` | `从顶部黑边往下拖拽` | 顶部提示文字，`hint=""` 隐藏 |
| `dpr` | 设备 DPR（上限 2） | 渲染倍率 |

### 事件

| 事件 | detail | 触发时机 |
|------|--------|----------|
| `lg-search` | `{ text }` | 输入内容变化 |
| `lg-search-submit` | `{ text }` | 按回车 |
| `lg-search-close` | `{}` | 搜索框收回 |

```js
document.querySelector('liquid-glass-search').addEventListener('lg-search-submit', function(e) {
  console.log('搜索:', e.detail.text);
});
```

### 调整参数（JS API）

对应原 demo 调参面板的 8 个值，用 `setParams` 只传想改的项：

```js
var el = document.querySelector('liquid-glass-search');

el.setParams({
  k: 80,       // 融合半径（液颈粗细），默认 64
  height: 18,  // 透镜高度（折射过渡带），默认 18
  refract: 14, // 折射强度，默认 14
  hl: 1.5,     // 高光强度，默认 1.5
  ab: 0.12,    // 色差，默认 0.12
  cont: 0.5,   // 黑玻璃强度，默认 0.5
  om: 11,      // 弹簧频率 ω，默认 11
  ze: 0.72     // 弹簧阻尼比 ζ，默认 0.72
});
```

### 读写文字

事件负责"发出"（`lg-search` / `lg-search-submit`），另外提供直接读写：

```js
el.getValue();      // 读当前文字
el.setValue('你好'); // 写文字（会触发 lg-search 事件）
el.setValue('');    // 清空
```

### 注意事项

- 需要 **WebGL2**（2017 年后的浏览器均支持）；不支持时组件静默不渲染并打印警告
- 组件自带黑色底（iPadOS 搜索唤醒的场景色），如需透底可在外部容器叠背景


## 18. 主题 {#theme}

liquid-glass 支持浅色/深色两种主题，通过 `dark` 属性控制。

### 静态设置

```html
<!-- 浅色主题（默认，不写 dark） -->
<liquid-glass mode="toggle" style="width:380px;height:200px"></liquid-glass>

<!-- 深色主题 -->
<liquid-glass mode="toggle" dark style="width:380px;height:200px"></liquid-glass>
```

浅色 = 白底卡片 + 黑色文字。深色 = 黑底卡片 + 白色文字。

**所有组件都受主题影响：** 开关/滑块的白卡底色（白↔黑）、标签栏容器色、按钮组默认背景色、弹窗遮罩色、滚动容器卡片底色，全部跟着 `dark` 走。只有壁纸（透明背景版那部分）不受主题影响——它永远折射壁图片。

### 动态切换（JS）

```html
<liquid-glass id="theme-demo" mode="toggle" dark style="width:380px;height:200px"></liquid-glass>
<button onclick="toggleTheme()">切换主题</button>

<script>
  var el = document.getElementById('theme-demo');
  function toggleTheme() {
    if (el.hasAttribute('dark')) {
      el.removeAttribute('dark'); // 变浅色
    } else {
      el.setAttribute('dark', ''); // 变深色
    }
  }
</script>
```

`setAttribute('dark', '')` / `removeAttribute('dark')` 会触发组件内部重绘，无需手动调用任何方法。

### overlay-buttons（内置切换按钮）

```html
<liquid-glass mode="toggle" dark overlay-buttons style="width:380px;height:200px"></liquid-glass>
```

加上 `overlay-buttons` 属性后，组件右上角会渲染两个 Canvas 内按钮：

| 按钮 | 图标 | 功能 |
|------|------|------|
| 返回 | ← 箭头 | 派发 `lg-back` 事件，组件内部切回上一视图 |
| 主题切换 | 太阳/月亮 | 切换 `dark` 属性的有无（浅↔深） |

两个按钮在 WebGL Canvas 内部渲染（不是 HTML 元素），带玻璃质感和触摸反馈。点击主题切换按钮后，组件自动 `addAttribute`/`removeAttribute('dark')` 并重绘。

**如果只想单独显示主题切换按钮（不要返回按钮）：**

```html
<liquid-glass mode="toggle" theme-button style="width:380px;height:200px"></liquid-glass>
```

`theme-button` 属性只显示主题切换按钮，不影响返回按钮的显示。两个属性可组合：

| 属性 | 返回按钮 | 主题切换 |
|------|---------|---------|
| 都不设 | 隐藏 | 隐藏 |
| `overlay-buttons` | 显示 | 显示 |
| `theme-button` | 隐藏 | 显示 |
| 两个都设 | 显示 | 显示 |

### 读取当前主题状态

```js
var el = document.querySelector('liquid-glass');
console.log('当前主题:', el.hasAttribute('dark') ? '深色' : '浅色');

el.addEventListener('lg-statechange', function(e) {
  console.log('主题变为:', e.detail.dark ? '深色' : '浅色');
});
```

### 多组件独立主题

每个 `<liquid-glass>` 的主题是**独立的**。A 深色不影响 B 浅色：

```html
<liquid-glass mode="toggle" dark style="width:380px;height:200px"></liquid-glass>       <!-- 深色 -->
<liquid-glass mode="toggle" style="width:380px;height:200px"></liquid-glass>            <!-- 浅色 -->
```

### 主题对壁纸的影响

壁纸图片本身**不变色**——深色模式下壁纸还是那张图。但白卡底色会翻转为黑卡底色，文字颜色也跟着翻转。

---

## 19. 渲染参数调优 {#render}

```html
<!-- 限制渲染分辨率最高 2x（省 GPU，手机上效果明显） -->
<liquid-glass mode="toggle" dpr="2"></liquid-glass>

<!-- 直角风格容器 -->
<liquid-glass mode="bottom-tabs" corner-style="0"></liquid-glass>

<!-- 胶囊风格容器 -->
<liquid-glass mode="bottom-tabs" corner-style="2"></liquid-glass>

<!-- 触屏时玻璃模糊更重 -->
<liquid-glass mode="slider" blur-tap-cap="30"></liquid-glass>
```

| 参数 | 作用 | 范围 | 默认 |
|------|------|------|------|
| `dpr` | 渲染分辨率上限。`"1"` 强制 1x（可察觉轻微模糊）。**默认 cap 在 1.5**，顶配传设备 DPR（如 `"2"`） | ≥0.5 | 1.5 |
| `corner-style` | `"0"`直角 `"1"`圆角 `"2"`胶囊 | 0/1/2 | `"1"` |
| `blur-tap-cap` | 手指按住时玻璃模糊强度 | 1-33 | 17 |
| `overlay-buttons` | 右上角显示「返回」「主题切换」按钮 | 布尔属性 | 不显示 |
| `theme-button` | 右上角单独显示「主题切换」按钮，不影响返回按钮 | 布尔属性 | 不显示 |

---

## 20. SVG 图标速查表 {#icons}

直接复制粘贴到 `icon` 字段，全部 `viewport: 24`。

| 图标 | 名称 | path |
|------|------|------|
| 🏠 | 首页 | `M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z` |
| 🔍 | 搜索 | `M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z` |
| ❤️ | 心形 | `M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z` |
| 👤 | 人形 | `M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z` |
| ⭐ | 星星 | `M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z` |
| ✈️ | 飞行 | `M400 552 L147 653 q-24 10 -45.5 -4.5 T80 608 v-22 q0 -12 5.5 -23 t15.5 -18 l299 -209 v-176 q0 -33 23.5 -56.5 T480 80 q33 0 56.5 23.5 T560 160 v176 l299 209 q10 7 15.5 18 t5.5 23 v22 q0 26 -21.5 40.5 T813 653 L560 552 v144 l103 72 q8 6 12.5 14.5 T680 801 v24 q0 20 -16.5 32.5 T627 864 l-147 -44 l-147 44 q-20 6 -36.5 -6.5 T280 825 v-24 q0 -10 4.5 -18.5 T297 768 l103 -72 v-144 Z` |

**飞行图标 viewport = 960**（默认值即正确，不传 viewport），其余图标 viewport = 24。

### 如何获取更多图标

1. 打开 https://fonts.google.com/icons
2. 选图标 → 点右上角下载 → 选 **SVG**
3. 用文本编辑器打开 `.svg` 文件
4. 找到 `<path d="...">` ，复制引号内的内容
5. 贴到 `icon` 字段，加 `viewport: 24`

---

## 21. 常见报错与排查 {#troubleshooting}

### 1. `WARNING: Too many active WebGL contexts`

**原因：** 浏览器限制 8-16 个 WebGL context。你创建了太多 `<liquid-glass>` 元素而没销毁旧的。

**解决：** 先 `remove()` 旧元素再创建新的：

```js
// 错：直接 innerHTML = '' → 元素移除但 WebGL context 可能没释放
container.innerHTML = '';

// 对：逐个 remove 触发 disconnectedCallback → dispose
var old = container.querySelectorAll('liquid-glass');
for (var i = 0; i < old.length; i++) old[i].remove();
container.innerHTML = '';
```

### 2. `Uncaught ReferenceError: xxx is not defined`

**原因：** 组件 JS 内部变量作用域 bug（如 `s2TrackW` / `t1TrackY` / `SLIDER_KNOB_HIT_H`）。**当前版本已全部修复。** 如果你还在用旧版 liquid-glass.js，更新到最新。

### 3. `[liquid-glass] wallpaper load failed`

**原因：** 壁纸图片跨域且服务端没返回 `Access-Control-Allow-Origin` 头。

**解决：** 图片放同域，或用 `data:` URL，或服务端加 CORS 头。

### 4. JS API vs HTML 属性

**问题：** 用 `setAttribute('tabs', JSON.stringify(...))` 设 tab 配置，渲染出来还是默认的 "Tab 1/2/3" + 飞机图标。

**原因：** Web Component 生命周期时序。`mode` 的 `attributeChangedCallback` 触发 `_rebuild` 时，`tabs` 属性可能还没解析完，导致 `_tabsConfig` 为 `null`。

**解决：一律用 JS API。** 不要传 HTML 属性 `tabs` / `buttons` / `dialog` / `scroll`。用 `el.setTabs()` / `el.setButtons()` / `el.setDialog()` / `el.setScroll()`。

```js
// 错
el.setAttribute('tabs', JSON.stringify([[...]]));

// 对
requestAnimationFrame(function() {
  el.setTabs([[...]]);
});
```

### 5. 图标不显示或极小

**原因：** `viewport` 没传，默认 960，Material Icons 需要 24。

**现象：** 图标存在但肉眼几乎看不见（缩放为 2.5%）。

**解决：** 加 `viewport: 24`。

### 6. 容器不渲染（空白）

**原因：** `<liquid-glass>` 没有 CSS 宽高。Canvas 尺寸 = CSS 尺寸 × DPR，0 宽高 = 不渲染。

**解决：**

```html
<!-- 错 -->
<liquid-glass mode="toggle"></liquid-glass>

<!-- 对 -->
<liquid-glass mode="toggle" style="width:380px;height:200px"></liquid-glass>
```

### 7. `mode="scroll"` 不渲染滚动容器

**原因：** mode 字符串是 `"scroll-container"`（带连字符），不是 `"scroll"`。

**现象：** 写 `mode="scroll"` → 组件回退到默认 mode `"bottom-tabs"` → 显示 3 个 tab。

**解决：** `mode="scroll-container"`。

---

## 22. 页面架构建议 {#architecture}

### 场景 A：展示页（多个静态组件）

每个组件一个 `<liquid-glass>`，全写在一个 HTML 里。**限制：总共不超过 6-8 个**（WebGL context 上限）。

```html
<script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

<liquid-glass mode="single-toggle"  style="width:380px;height:200px"></liquid-glass>
<liquid-glass mode="single-slider"  style="width:380px;height:200px"></liquid-glass>
<liquid-glass mode="single-bottom-tabs" id="tabs" style="width:380px;height:120px"></liquid-glass>
<liquid-glass mode="buttons"        id="btns" style="width:380px;height:400px"></liquid-glass>

<script>
  requestAnimationFrame(function() {
    document.getElementById('tabs').setTabs([[...]]);
    document.getElementById('btns').setButtons([...]);
  });
</script>
```

**多个组件卡首屏？** 每个 `<liquid-glass>` 一插入 DOM 就会同步创建 WebGL context 并编译 shader，四五个组件同时插入会把首帧卡到秒级。建议**错峰插入**：先创建好元素但不放进 DOM，每 ~150ms 追加一个：

```js
var jobs = [
  [elA, '#stageA'], [elB, '#stageB'], [elC, '#stageC']
];
var i = 0;
(function next() {
  if (i >= jobs.length) return;
  var job = jobs[i++];
  document.querySelector(job[1]).appendChild(job[0]);
  setTimeout(next, 150);
})();
```

（`elA`/`elB`/`elC` 是已 `document.createElement('liquid-glass')` 并设好 `mode`/`dpr`/`wallpaper` 属性的元素。注意：光"不设 mode"没用，必须延迟插入 DOM 才生效。）

### 场景 B：SPA / 组件切换（Tab 式）

一个容器，点按钮切换 mode，**每次切换先销毁旧元素**：

```html
<script src="https://glass.goose.gs.cn/liquid-glass.js"></script>

<div id="nav">
  <button data-mode="single-toggle">开关</button>
  <button data-mode="single-slider">滑块</button>
</div>
<div id="stage" style="width:380px;height:200px;border-radius:28px;overflow:hidden;background:#0a0e17"></div>

<script>
  var stage = document.getElementById('stage');
  document.getElementById('nav').addEventListener('click', function(e) {
    var btn = e.target.closest('button');
    if (!btn) return;

    // 销毁旧的
    var old = stage.querySelectorAll('liquid-glass');
    for (var i = 0; i < old.length; i++) old[i].remove();
    stage.innerHTML = '';

    // 创建新的
    // 注意时序：先 append 进 DOM（触发 connected）再 setAttribute('mode')，
    // 否则 mode 在 connected 前已设置，组件不会重建（显示空白/默认）。
    var el = document.createElement('liquid-glass');
    el.style.cssText = 'width:100%;height:100%';
    stage.appendChild(el);
    el.setAttribute('mode', btn.getAttribute('data-mode'));
  });
</script>
```

### 场景 C：动态切换的坑（预加载 vs 销毁重建）

做引导式 / 轮播 / 分页时，**不要"预加载所有组件再切"**。这是本次 demo 踩的最深一个坑：

**错误做法（会炸）：**

```js
// 错：一次性把所有组件建好塞进隐藏容器，切页时切 display
var holders = [];
[['toggle', el1], ['slider', el2], ...].forEach(function(h) {
  var div = document.createElement('div');
  div.style.display = 'none';           // 隐藏
  var el = document.createElement('liquid-glass');
  el.setAttribute('mode', h[0]);
  div.appendChild(el);
  document.body.appendChild(div);       // connected 建了 WebGL context
  holders.push(div);
});
// 问题：所有隐藏组件都持有 WebGL context 不释放，切几次就超 8-16 上限，
// 浏览器强制丢 context → 控制台刷 "useProgram: attempt to use a deleted object"
```

**正确做法：每次切换先销毁旧的，再建新的。** 全程只有 1 个 context 活着，绝不会超限：

```js
var stage = document.getElementById('stage');
function showMode(mode, cfg) {
  // 1. 销毁旧组件（remove 触发 disconnectedCallback → 释放 context）
  var old = stage.querySelectorAll('liquid-glass');
  for (var i = 0; i < old.length; i++) old[i].remove();
  stage.innerHTML = '';

  // 2. 建新的：先 append 进 DOM（connected），再设 mode（触发 rebuild）
  var el = document.createElement('liquid-glass');
  el.style.cssText = 'width:100%;height:100%';
  stage.appendChild(el);
  el.setAttribute('mode', mode);
  if (cfg && cfg.tabs) el.setTabs(cfg.tabs);
  if (cfg && cfg.buttons) el.setButtons(cfg.buttons);
}
```

**两个必守时序（本次 demo 反复踩）：**

1. **必须 `append` 进"已在 DOM 的容器"再设 mode。** 元素 append 到游离容器（还没 `document.body.appendChild` 的 div）**不会触发 `connectedCallback`**，此时设 mode 会被丢弃 → 组件空白/全黑。
2. **先 append（默认 mode）再 `setAttribute('mode')`。** 如果先设 mode 再 append，connected 时 mode 已存在，组件不会 `_rebuild`，也显示空白。

**一个组件只建一次 context 很便宜**（毫秒级），没必要为省这点时间预加载而冒超限风险。

### 场景 D：壁纸预加载

如果你有一个大壁纸（比如 `data:` URL 约 800KB），想避免每个组件各自加载一次，可以提前存到全局变量：

```html
<script>
  // 预定义壁纸
  window.LG_WALLPAPER = 'data:image/jpeg;base64,/9j/4AAQ...';
</script>

<liquid-glass id="a" mode="toggle" style="width:380px;height:200px"></liquid-glass>
<liquid-glass id="b" mode="slider" style="width:380px;height:200px"></liquid-glass>

<script>
  var wp = window.LG_WALLPAPER;
  document.getElementById('a').setAttribute('wallpaper', wp);
  document.getElementById('b').setAttribute('wallpaper', wp);
</script>
```

---

> **GooseHyperGlassCDN2.0**
> **基于：** [Kyant0/AndroidLiquidGlass](https://github.com/Kyant0/AndroidLiquidGlass)（Android 原项目）
> **二创自：** <span style="font-size:28px;font-weight:900;color:#ff6600">martin65536/liquid-glass-webgl</span>（WebGL 移植版）
> **CDN 地址：** `https://glass.goose.gs.cn/liquid-glass.js`
> **文件大小：** ~345KB（gzip ~95KB）
> **浏览器要求：** 支持 WebGL 1.0 + Custom Elements v1 + ES2020（Chrome 80+ / Edge 80+ / Safari 14+ / Firefox 80+）
