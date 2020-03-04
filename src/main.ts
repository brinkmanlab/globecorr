import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import HTMLFragment from './components/HTMLFragment.vue';

import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { path: '/', component: HTMLFragment, name: "Home", props: {content: require('html-loader!@/assets/home.htm'), slug:'home'} },
    ]
});

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');
