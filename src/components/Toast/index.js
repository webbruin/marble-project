import { createApp } from 'vue'
import toast from './Toast.vue'

let _instance = null
let container = null

export function createToast(options) {
  // 如果已经存在一个 Toast，先关闭它（保证同时只有一个）
  if (_instance) {
    _instance.close()
    // 清理旧的 DOM
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }

  // 创建挂载点
  container = document.createElement('div')
  document.body.appendChild(container)

  // 创建 Vue 应用实例并挂载
  const app = createApp(toast, {
    ...options,
    // 组件关闭后自动卸载并移除 DOM
    onUnmounted: () => {
      app.unmount()
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      _instance = null
      container = null
    }
  })

  const instance = app.mount(container)
  _instance = instance
  return instance
}

// 简化调用方法
export const Toast = {
  info: (message, duration = 2000) => createToast({ message, type: 'info', duration }),
  success: (message, duration = 2000) => createToast({ message, type: 'success', duration }),
  error: (message, duration = 2000) => createToast({ message, type: 'error', duration }),
  warning: (message, duration = 2000) => createToast({ message, type: 'warning', duration }),
  loading: (message, duration = 10000000) => createToast({ message, type: 'warning', duration, loading: true })
}