import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/700.css'
import '@fontsource/noto-serif-sc/400.css'
import '@fontsource/noto-serif-sc/700.css'
import '@fontsource/zcool-xiaowei/400.css'
import '@fontsource/ma-shan-zheng/400.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
