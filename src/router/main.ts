import HTMLFragment from "@/components/HTMLFragment.vue";
import {RouteConfig} from "vue-router/types/router";
import Visualization from "@/views/Visualization.vue";
import Home from "@/views/Home.vue";

const routes: RouteConfig[] = [
    { path: '/', component: Home, name: "Home" },
    { path: '/globe', component: Visualization, name: "Exposome Globe" },
    {
        path: '/tutorial',
        component: HTMLFragment,
        name: "Tutorial",
        props: {content: require('html-loader!@/assets/tutorial.htm'), slug: 'tutorial'}
    },
    {
        path: '/faq',
        component: HTMLFragment,
        name: "FAQ",
        props: {content: require('html-loader!@/assets/faq.htm'), slug: 'faq'}
    },
    {
        path: '/acknowledgements',
        component: HTMLFragment,
        name: "Acknowledgements",
        props: {content: require('html-loader!@/assets/acknowledgements.htm'), slug: 'acknowledgements'}
    },
];

export default routes;
