<template>
  <div class="dashboard">
    <div class="card-container" >
      <el-card class="card-item" shadow="hover" >
        <div class="card-header" >
          <span>用户数量</span>
        </div>
        <div class="card-content">
          <div class="count-value">{{ userCount }}</div>
          <div class="count-label">用户</div>
        </div>
      </el-card>

      <el-card class="card-item" shadow="hover">
        <div class="card-header">
          <span>菜品数量</span>
        </div>
        <div class="card-content">
          <div class="count-value">{{ dishCount }}</div>
          <div class="count-label">菜品</div>
        </div>
      </el-card>

      <el-card class="card-item" shadow="hover">
        <div class="card-header">
          <span>外卖员数量</span>
        </div>
        <div class="card-content">
          <div class="count-value">{{ deliveryCount }}</div>
          <div class="count-label">外卖员</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const userCount = ref(0);
    const dishCount = ref(0);
    const deliveryCount = ref(0);

    onMounted(() => {
      axios.get("http://localhost:8080/user/count").then(response => {
        userCount.value = response.data;
      }).catch(error => {
        console.error(error);
      });

      axios.get("http://localhost:8080/menu/count").then(response => {
        dishCount.value = response.data;
      }).catch(error => {
        console.error(error);
      });

      axios.get("http://localhost:8080/user/count2", { params: { type: "delivery" } }).then(response => {
        deliveryCount.value = response.data;
      }).catch(error => {
        console.error(error);
      });
    });

    return {
      userCount,
      dishCount,
      deliveryCount
    };
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  justify-content: center;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.card-item {
  width: 360px;
  background-color: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  color: #ffffff;
  background-color:#850220;
  border-bottom: 1px solid #e4e7ed;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.count-value {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;
}

.count-label {
  font-size: 16px;
  color: #888888;
}
</style>
