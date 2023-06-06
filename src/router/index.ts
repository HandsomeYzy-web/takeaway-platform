import {createRouter , createWebHashHistory ,RouteRecordRaw ,Router} from "vue-router";
import LoginRegister from "../components/LoginRegister.vue";
import user from "../components/user.vue";
import settleAccount from "../components/settleAccount.vue"
const routes : Array<RouteRecordRaw> = [
    {path: '/', component:LoginRegister},
    {path: '/user', component:user},
    {path: '/settleAccount', component:settleAccount}
]
const router : Router = createRouter({
    history:createWebHashHistory(),
    routes
})
export default router;