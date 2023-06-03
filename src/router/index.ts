import {createRouter , createWebHashHistory ,RouteRecordRaw ,Router} from "vue-router";
import LoginRegister from "../components/LoginRegister.vue";
import user from "../components/user.vue";
const routes : Array<RouteRecordRaw> = [
    {path: '/', component:LoginRegister},
    {path: '/user', component:user}
]
const router : Router = createRouter({
    history:createWebHashHistory(),
    routes
})
export default router;