import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './routers/routers'; // Importa el archivo de rutas

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router, // Registra el router aquí
  render: h => h(App)
}).$mount('#app');
