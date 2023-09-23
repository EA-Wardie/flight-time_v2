import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import Home from '@/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home/current-session',
    },
    {
        path: '/home/',
        component: Home,
        children: [
            {
                path: '',
                redirect: 'current-session',
            },
            {
                path: 'current-session',
                component: () => import('@/views/CurrentSession.vue'),
            },
            {
                path: 'all-sessions',
                component: () => import('@/views/AllSessions.vue'),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
