import 'babel-polyfill';
import fastclick from 'fastclick';
import 'common/stylus/index.styl';
import Vue from 'vue';
import App from './App';
import router from './router';

fastclick.attach(document.body);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
