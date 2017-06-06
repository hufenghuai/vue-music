import 'babel-polyfill';
import fastclick from 'fastclick';
import VueLazyLoad from 'vue-lazyload';
import 'common/stylus/index.styl';
import Vue from 'vue';
import App from './App';
import router from './router';

const url = require('common/image/default.png');

fastclick.attach(document.body);

Vue.use(VueLazyLoad, {
  loading: url,
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
