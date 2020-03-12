import {RouteConfig} from "vue-router/types/router";
import Visualization from "@/views/Visualization.vue";
import Home from "@/views/Home.vue";

//import content from '@/../static/*.md';
import tutorial from '#/tutorial.md';
import faq from '#/faq.md';
import acknowledgements from '#/acknowledgements.md';

const routes: RouteConfig[] = [
    { path: '/', component: Home, name: "Home" },
    { path: '/globe', component: Visualization, name: "Exposome Globe" },
    {
        path: '/tutorial',
        component: tutorial({}),
        name: "Tutorial",
        props: {slug: 'tutorial'}
    },
    {
        path: '/faq',
        component: faq({}),
        name: "FAQ",
        props: {slug: 'faq'}
    },
    {
        path: '/acknowledgements',
        component: acknowledgements({}),
        name: "Acknowledgements",
        props: {slug: 'acknowledgements'}
    },
];

export default routes;
