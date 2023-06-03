<template>
  <div class="dashboard">
    <div class="sidebar">
      <!-- 导航栏内容 -->
      <div class="user-profile">
        <!-- 用户头像和姓名 -->
        <div class="user-avatar">
          <img :src="user.avatar" alt="User Avatar">
        </div>
        <div class="user-name">{{ user.name }}</div>
      </div>
      <ul class="navigation">
        <!-- 导航菜单项 -->
        <li v-for="menuItem in menuItems" :key="menuItem.id" class="menu-item">
          {{ menuItem.label }}
        </li>
      </ul>
    </div>
    <div class="content">
      <div class="search-bar">
        <!-- 搜索框 -->
        <input v-model="searchQuery" placeholder="Search" class="search-input">
      </div>
      <!-- 右侧菜品展示 -->
      <div class="dishes">
        <!-- 菜品列表 -->
        <div v-for="dish in dishes" :key="dish.id" class="dish-item" @click="openModal(dish)">
          <div class="dish-image">
            <img :src="dish.image" alt="Dish Image">
          </div>
          <div class="dish-name">{{ dish.name }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-container" v-if="isModalOpen">
    <div class="modal-content">
      <div class="modal-dish-image">
        <img :src="selectedDish.image" alt="Dish Image">
      </div>
      <div class="modal-dish-details">
        <h3>{{ selectedDish.name }}</h3>
        <p>{{ selectedDish.description }}</p>

        <div class="button-container">
          <div class="quantity-container">
            <button class="modal-button" @click="decreaseQuantity">-</button>
            <span class="quantity">{{ quantity }}</span>
            <button class="modal-button" @click="increaseQuantity">+</button>
          </div>
          <div class="action-buttons">
            <button class="modal-button" @click="addToCart">选购</button>
            <button class="modal-button" @click="closeModal">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      isModalOpen: false, // 模态框的显示状态
      selectedDish: null,// 当前选中的菜品
      quantity: 1, // 初始化数量为1
      user: {
        name: 'John Doe',
        avatar: 'public/img/R-C.jpg'
      },
      menuItems: [
        { id: 1, label: 'Menu Item 1' },
        { id: 2, label: 'Menu Item 2' },
        { id: 3, label: 'Menu Item 3' }
      ],
      searchQuery: '',
      dishes: [
        { id: 1, name: 'Dish 1', image: 'public/img/R-C.jpg' },
        { id: 2, name: 'Dish 2', image: 'public/img/R-C.jpg' },
        { id: 3, name: 'Dish 3', image: 'public/img/R-C.jpg' },
        { id: 4, name: 'Dish 4', image: 'public/img/R-C.jpg' },
        { id: 5, name: 'Dish 5', image: 'public/img/R-C.jpg' },
        { id: 1, name: 'Dish 1', image: 'public/img/R-C.jpg' },
        { id: 2, name: 'Dish 2', image: 'public/img/R-C.jpg' },
        { id: 3, name: 'Dish 3', image: 'public/img/R-C.jpg' },
        { id: 4, name: 'Dish 4', image: 'public/img/R-C.jpg' },
        { id: 5, name: 'Dish 5', image: 'public/img/R-C.jpg' }
      ]
    };
  },
  methods: {
    // ...原有方法...
    openModal(dish) {
      this.selectedDish = dish; // 设置当前选中的菜品
      this.isModalOpen = true; // 打开模态框
    },

    closeModal() {
      this.isModalOpen = false; // 关闭模态框
    },

    increaseQuantity() {
      this.quantity++; // 增加数量
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--; // 减少数量，但不会低于1
      }
    },

  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
}

.sidebar {
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 16px;
  font-weight: bold;
}

.navigation {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.dishes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.dish-item {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.dish-image {
  height: 150px;
  margin-bottom: 10px;
  overflow: hidden;
}

.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dish-name {
  font-size: 16px;
  font-weight: bold;
}

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 800px;
  height: 600px;
  background-color: #fff;
  padding: 30px;
  border-radius: 5px;
}

.modal-dish-image{
  width: 50%;
  height: 100%;
  border-right: black solid 1px;
}

.modal-dish-image img{
  width: 100%;
  height: 100%;
}

.modal-dish-details {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.quantity-container {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
}

.quantity {
  margin: 0 10px; /* 添加一些间距 */
}

.modal-button {
  /* 样式化按钮 */
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>
