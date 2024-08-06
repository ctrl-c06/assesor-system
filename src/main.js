import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import socket from './services/socket'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';


const app = createApp(App)
app.use(router)
app.provide("socket", socket)
app.component('v-select', vSelect)

app.mount('#app')
