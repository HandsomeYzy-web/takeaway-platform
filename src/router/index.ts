import {createRouter , createWebHashHistory ,RouteRecordRaw ,Router} from "vue-router";
import LoginRegister from "../components/LoginRegister.vue";
import user from "../components/user.vue";
import settleAccount from "../components/settleAccount.vue"
const routes : Array<RouteRecordRaw> = [
    {path: '/', name: 'LoginRegister', component:LoginRegister},
    {path: '/user', name:'user', component:user },
    {path: '/settleAccount',name: 'settleAccount', component:settleAccount}
]
const router : Router = createRouter({
    history:createWebHashHistory(),
    routes
})
export default router;