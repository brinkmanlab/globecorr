import HTMLFragment from "@/components/HTMLFragment.vue";
import {RouteConfig} from "vue-router/types/router";
import Visualization from "@/components/Visualization.vue";

const routes: RouteConfig[] = [
    {
        path: '/',
        component: HTMLFragment,
        name: "Home",
        props: {content: require('html-loader!@/assets/home.htm'), slug: 'home'}
    },
    {path: '/globe', component: Visualization, name: "Exposome Globe", props: {}},
];

export default routes;
