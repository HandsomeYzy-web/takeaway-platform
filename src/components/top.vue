<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
      style="height: 60px;"
        background-color="#545c64"
  >
    <el-menu-item index="#" style="font-size: 30px;font-style: italic;color: white">在线订餐后台管理系统</el-menu-item>
    <el-sub-menu index="2" style="margin-left: 70%;">
      <template #title> <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      /></template>
      <el-menu-item index="2-1" style="color: white">admin</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>

</script>

<style>
</style>