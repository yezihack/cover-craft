# 🎨 百里封面设计 — Cover Designer

> 浏览器端的封面图生成工具，面向内容创作者的实时设计画板。

## 简介

**百里封面设计**（Cover Designer）是一款基于 Web 的封面图编辑器，无需安装任何设计软件，打开浏览器即可使用。通过左侧配置面板调整封面样式，右侧实时预览效果，最后导出高质量图片。

适用于公众号封面、小红书笔记图、B站横幅、YouTube 缩略图、社交媒体卡片等场景。

## 功能

| 模块 | 能力 |
| --- | --- |
| **背景设置** | 纯色 / 渐变（多方向）/ 图片上传，支持透明度调节 |
| **图标设置** | Iconify 图标库检索、自定义图片上传，支持大小 / 阴影 / 位置 |
| **文本图层** | 多行文本自由叠加，支持字体 / 字号 / 颜色 / 加粗 / 斜体 / 字间距 / 旋转 / 阴影 |
| **水印** | 自定义文本水印，字体 / 大小 / 颜色 / 透明度 / 位置均可控 |
| **导出** | PNG / JPEG / WebP 格式，支持多平台预设尺寸和自定义分辨率，随机文件名 |
| **主题** | 内置多套配色主题，一键切换 |
| **配置管理** | 保存当前配置、重置到默认 |
| **实时预览** | 右侧等比缩放实时渲染画布 |

## 支持的平台预设

| 平台 | 尺寸 |
| --- | --- |
| 通用 16:9 HD | 1920 × 1080 |
| 公众号封面首图 | 900 × 383 |
| 公众号次图 | 200 × 200 |
| 小红书正方形 | 1080 × 1080 |
| 小红书竖图 | 1080 × 1440 |
| B站横幅 | 1920 × 540 |
| YouTube 缩略图 | 1280 × 720 |
| Twitter/X 卡片 | 1200 × 628 |
| GitHub 社交预览 | 1280 × 640 |

## 技术栈

| 层面 | 技术 |
| --- | --- |
| 框架 | [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`) |
| 语言 | [TypeScript](https://www.typescriptlang.org/) |
| 构建 | [Vite](https://vitejs.dev/) |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) |
| 状态管理 | [Pinia](https://pinia.vuejs.org/) |
| 图标 | [Iconify](https://iconify.design/) |
| 导出 | [html-to-image](https://github.com/bubkoo/html-to-image) |
| 拖拽排序 | [SortableJS](https://sortablejs.com/) / [VueDraggable](https://github.com/SortableJS/vue.draggable.next) |
| 字体 | Inter / Noto Sans SC / Noto Serif SC / ZCOOL XiaoWei / Ma Shan Zheng |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:7005）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```text
src/
├── App.vue                  # 主布局：顶栏 + 左面板 + 预览区
├── main.ts                  # 入口
├── style.css                # 全局样式
├── components/
│   ├── layout/              # 布局组件（Header / PanelLeft / PanelRight）
│   ├── panels/              # 配置面板（背景/图标/文本/水印/导出）
│   ├── preview/             # 画布预览（背景/图标/文本/水印渲染）
│   └── ui/                  # 通用 UI 组件（颜色选择器/数字输入/滑块等）
├── composables/             # 组合式函数（导出/字体加载/拖拽定位等）
├── stores/                  # Pinia 状态（背景/图标/文本/水印/导出/主题）
├── constants/               # 常量定义（预设/比例/字体/主题）
└── types/                   # TypeScript 类型定义
```

## LICENSE

[MIT](LICENSE)
