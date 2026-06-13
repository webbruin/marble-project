# CLAUDE.md

## 项目概览

- BingoBang（弹珠潮玩）—— 一个移动端优先的 Vue 3 SPA 在线弹珠游戏平台
- 构建工具：Vite 7 + Vue 3（Composition API，`<script setup>`）+ vue-router 5
- 样式：Less，每个组件使用 `scoped` + `lang="less"`
- 无 TypeScript、无状态管理库、无测试框架、无 ESLint
- 代码格式化：仅使用 Prettier（无分号、单引号、每行 100 字符）

## 常用命令

```bash
yarn dev            # 启动开发服务器，端口 7100
yarn dev:test       # 测试环境开发（VITE_API_BASE_URL=http://139.224.246.134:6180）
yarn dev:prod       # 生产环境开发
yarn build          # 生产环境构建
yarn build:test     # 测试环境构建
yarn build:prod     # 生产环境构建
yarn preview        # 预览构建产物
yarn format         # prettier --write src/
```

## 目录结构

```
src/
  main.js            # 应用入口，注册全局变量（window.$toast、window.$modal、window.api）
  App.vue            # 根组件，仅包含 <RouterView>
  api/index.js       # Axios 实例（15 秒超时，token 拦截器，401 处理）
  router/index.js    # 路由配置 + beforeEach 登录守卫
  components/        # 公共组件：Header、Footer、InfiniteScroll、各类弹窗、Toast/、Modal/、FormData/
  views/             # 页面组件（29 个页面）
  assets/            # main.less、base.less、图片资源
  utils/             # 工具函数（aes.js、qrcode.js、格式化函数、枚举、城市/区域数据）
  trtc/              # 腾讯实时音视频 SDK
```

## 全局变量（在 main.js 中注册）

| 变量              | 用法                                      |
|-------------------|------------------------------------------|
| `window.api`      | Axios 实例，用于发起 API 请求              |
| `window.$toast`   | `$toast.info/success/error/warning/loading/close(消息, 持续时间?)` |
| `window.$modal`   | `$modal.show({ ...参数 })`                |

## API 规范

- 所有接口统一使用 POST 请求，完整路径为 `VITE_API_BASE_URL + 接口路径`，接口路径以 `/pinball/` 开头
- 请求示例：`api.post('/pinball/路径/接口名', 参数)`
- 响应格式：`{ code: 200, data: ..., message: '...' }` —— `code === 200` 表示成功
- 全局拦截器已统一处理非 200 错误（toast 出 message），调用方无需再手动 toast
- 401 处理：清除 token，1 秒后跳转到 `/login`
- 错误处理模式：

```js
try {
  const res = await api.post('/pinball/路径', params)
  if (res.code === 200) {
    // 处理成功
  }
} catch (e) {
  $toast.info('系统错误')
}
```

## Vue 组件规范

- 每个 `.vue` 文件结构顺序：`<template>` → `<script setup>` → `<style scoped lang="less">`
- import 顺序：先引入 vue 组合式 API，再引入 vue-router，最后引入 `@/` 开头的组件
- 路由：`const router = useRouter(); const route = useRoute()`
- 状态管理：使用 `ref()` / `reactive()` —— 项目未使用 Pinia 或 Vuex
- Props 定义：使用 `defineProps({ 属性名: { type: 类型, default: 默认值 } })` 或简写 `defineProps({ 属性名: String })`
- 不使用 TypeScript 类型或注解
- 全局注册的组件：`Header`（在 main.js 中通过 app.component 注册）
- 其余组件在各页面中按需局部引入

## 移动端适配方案

每个组件的 `<style scoped>` 中均定义以下 Less 混入：

```less
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}
```

使用方式：`.vw(16)[]` —— `[]` 是 Less 语法，用于展开返回值。
设计稿基准宽度为 375px，所有尺寸按视口宽度等比缩放。

## CSS 变量（在 main.less 中定义）

```css
--text--:        #848691   /* 次要文字色 */
--light-text--:  #272933   /* 主要文字色 */
--white--:       #FFFFFF
--orange--:      #FF7716
--red--:         #F20C32
--gold--:        #F7DBB1
```

使用 `var(--white--)` 语法引用变量。这是项目约定的 CSS 变量命名风格（双短横线结尾）。

## 登录与路由

- Token 存储在 `localStorage.getItem('token')`，在路由 `beforeEach` 守卫中校验
- 用户信息存储在 `localStorage.getItem('userInfo')`
- `needLoginPage` 数组（在 router/index.js 中）列出了所有需要登录的页面
- 未登录用户 → 跳转到 `/login`
- 已登录用户访问 `/login` → 跳转到首页

## 代码格式化（Prettier 配置）

- 不使用分号
- 使用单引号
- 每行最大 100 字符
- 提交前运行 `yarn format`

## 命名规范

- `.vue` 文件：PascalCase（如 `BallSuccess.vue`、`InfiniteScroll.vue`）
- `.js` 文件：kebab-case 或 camelCase（如 `city-data.js`、`generateTestUserSig.js`）
- 路由名称：kebab-case
- CSS 类名：kebab-case
- 变量/函数名：camelCase
