import './assets/main.less'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Header from './components/Header.vue'
import { Toast } from './components/Toast'
import { Modal } from './components/Modal'
import api from './api'

const app = createApp(App)

app.use(router)


app.mount('#app')

app.component('Header', Header)

window.$toast = Toast;
window.$modal = Modal;
window.api = api;