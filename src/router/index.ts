import {createRouter , createWebHashHistory ,RouteRecordRaw ,Router} from "vue-router";
import LoginRegister from "../components/LoginRegister.vue";
import user from "../components/user.vue";
import settleAccount from "../components/settleAccount.vue"
import delivery from "../components/delivery.vue"
import user2 from "../view/User/user2.vue";
import dish from "../view/Dish/dish.vue";
import delivery2 from "../view/Delivery/delivery2.vue";
import HomeView from "../view/stats/HomeView.vue"
const routes : Array<RouteRecordRaw> = [
    {path: '/', name: 'LoginRegister', component:LoginRegister},
    {path: '/user', name:'user', component:user },
    {path: '/settleAccount',name: 'settleAccount', component:settleAccount},
    {path: '/delivery',name: 'delivery' ,component:delivery},
    {path: '/HomeView', component: HomeView},
    {path: '/user2', component: user2},
    {path: '/dish', component: dish},
    {path: '/delivery2', component: delivery2},
]
const router : Router = createRouter({
    history:createWebHashHistory(),
    routes
})
export default router;