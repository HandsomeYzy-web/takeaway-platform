<template>
  <el-row class="tac" >
    <el-col :span="12" >

      <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          default-active="1"
          text-color="#fff"
          @select="handleMenuClick"
          style="width: 200px;
			    height: calc(100vh - 60px);
			"
      >
        <el-menu-item index="1">
            <el-icon><House /></el-icon>
          <span>主页</span>
        </el-menu-item>

        <el-menu-item index="2">
          <el-icon><DishDot /></el-icon>
          <span>菜品管理</span>
        </el-menu-item>

        <el-menu-item index="3">
          <el-icon>
            <el-icon><User /></el-icon>
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>

<!--        <el-menu-item index="4">-->
<!--          <el-icon>-->
<!--            <el-icon><Memo /></el-icon>-->
<!--          </el-icon>-->
<!--          <span>订单管理</span>-->
<!--        </el-menu-item>-->

        <el-menu-item index="5">
          <el-icon><UserFilled /></el-icon>
          <span>外卖员管理</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    handleMenuClick(index) {
      // 根据菜单项的索引值来触发不同的路由跳转
      if (index === '1') {
        this.$router.push('/HomeView'); // 跳转到首页
      } else if (index === '3') {
        this.$router.push('/user2'); // 跳转到用户管理页面
      } else if (index === '2') {
        this.$router.push('/dish'); // 跳转到菜品管理页面
      // } else if (index === '4') {
      //   this.$router.push('/order'); // 跳转到订单管理页面
      } else if (index === '5') {
        this.$router.push('/delivery2'); // 跳转到外卖员管理页面
      }
    },
  },

}
</script>

<style>


</style>



