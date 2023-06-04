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
        <li class="menu-item" @click="selectMenu(null)" :class="{ 'active': selectedMenu === null }">
          所有菜品
        </li>
        <li v-for="menuItem in menuItems" :key="menuItem.id" class="menu-item" @click="selectMenu(menuItem.id)" :class="{ 'active': selectedMenu === menuItem.id }">
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
        <div v-for="dish in filDishes" :key="dish.id" class="dish-item" @click="openModal(dish)">
          <div class="dish-image">
            <img :src="dish.image" alt="Dish Image">
          </div>
          <div class="dish-name">{{ dish.name }}</div>
          <div class="dish-price">¥{{ dish.price }}</div>
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
        <div>
          <h3>{{ selectedDish.name }}</h3>
          <p>水煮肉片</p>
          <p>原料：猪肉，u部分v啊u饿不饿哎iu啊额氯苯胺率如果热iu八嘎vu你问给别人认为会给如果和</p>
          <p>{{ selectedDish.description }}</p>
        </div>
        <div>
          <div class="price-container">
            <span class="price">¥{{ selectedDish.price }}</span>
          </div>
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
<!--    -->
    <div v-if="isCartVisible" class="cart">
      <div class="cart-header">
        <h2>购物车</h2>
        <span class="close" @click="closeCart">关闭</span>
      </div>
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-details">
            <h4>{{ item.name }}</h4>
            <p>价格: ¥{{ item.price }}</p>
            <p>数量: {{ item.quantity }}</p>
          </div>
          <div class="item-actions">
            <button @click="increaseQuantity(item)">+</button>
            <button @click="decreaseQuantity(item)">-</button>
            <button @click="removeFromCart(item)">删除</button>
          </div>
        </div>
      </div>
      <div class="cart-total">
        <p>总价: ¥{{ total }}</p>
        <button @click="checkout">去结算</button>
      </div>
    </div>
<!--    -->
  </div>

</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      //
      isCartVisible: false,
      cartItems: [],
      //
      selectedMenu: null, // 当前选中的菜单项的 ID
      searchQuery: '',
      isModalOpen: false, // 模态框的显示状态
      selectedDish: null, // 当前选中的菜品
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
      dishes: [
        { id: 1, name: 'Dish 1', image: 'public/img/R-C.jpg', price: 199, label: 'Menu Item 1'},
        { id: 2, name: 'Dish 2', image: 'public/img/R-C.jpg', price: 243, label: 'Menu Item 1'},
        { id: 3, name: 'Dish 3', image: 'public/img/R-C.jpg', price: 1923, label: 'Menu Item 1'},
        { id: 4, name: 'Dish 4', image: 'public/img/R-C.jpg', price: 133, label: 'Menu Item 2'},
        { id: 5, name: 'Dish 5', image: 'public/img/R-C.jpg', price: 14, label: 'Menu Item 2'},
        { id: 6, name: 'Dish 1', image: 'public/img/R-C.jpg', price: 19, label: 'Menu Item 1'},
        { id: 7, name: 'Dish 2', image: 'public/img/R-C.jpg', price: 1499, label: 'Menu Item 3'},
        { id: 8, name: 'Dish 3', image: 'public/img/R-C.jpg', price: 1959, label: 'Menu Item 3'},
        { id: 9, name: 'Dish 4', image: 'public/img/R-C.jpg', price: 1929, label: 'Menu Item 2'},
        { id: 10, name: 'Dish 5', image: 'public/img/R-C.jpg', price: 1979, label: 'Menu Item 2'}
      ]
    };
  },
  methods: {
    //
    openCart() {
      this.isCartVisible = true;
    },
    closeCart() {
      this.isCartVisible = false;
    },
    addToCart(item) {
      // 添加商品到购物车逻辑...
      this.cartItems.push(item);
      this.openCart();
    },
    removeFromCart(item) {
      const index = this.cartItems.indexOf(item);
      if (index > -1) {
        this.cartItems.splice(index, 1);
      }
    },
    checkout() {
      // 结算逻辑...
    },
    //
    // ...原有方法...
    selectMenu(menuId) {
      this.selectedMenu = menuId;
      this.searchQuery = ''; // 重置搜索框内容
    },

    openModal(dish) {
      this.selectedDish = dish; // 设置当前选中的菜品
      this.quantity = 1;
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
  },
  computed: {
    filDishes() {
      let filteredDishes = this.dishes;

      if (this.selectedMenu !== null) {
        filteredDishes = filteredDishes.filter(dish => dish.label === this.menuItems.find(item => item.id === this.selectedMenu).label);
      }

      if (this.searchQuery) {
        filteredDishes = filteredDishes.filter(dish => dish.name.includes(this.searchQuery));
      }

      return filteredDishes;
    },
    total() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
  }
};
</script>

<style scoped>
/*页面大容器布局begin*/
.dashboard {
  display: flex;
}
/*页面大容器布局end*/

/*页面左部大容器布局begin*/
.sidebar {
  /*左侧导航栏*/
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
}

.user-profile {
  /*用户头像和用户名区域*/
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  /*用户头像容器*/
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.user-avatar img {
  /*用户头像*/
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  /*用户名*/
  font-size: 16px;
  font-weight: bold;
}

.navigation {
  /*菜品分类区域*/
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  /*菜品分类*/
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  cursor: pointer;
  border: black 1px solid;
}

.menu-item.active {
  /*菜品分类点击*/
  background-color: #850220; /* 设置选中菜单项的背景色 */
  color: #ffffff; /* 设置选中菜单项的文字颜色 */
}
/*页面左部大容器布局end*/

/*页面右部大容器begin*/
.content {
  flex: 1;
  padding: 20px;
}

.search-bar {
  /*搜索框容器*/
  margin-bottom: 20px;
}

.search-input {
  /*搜索框样式*/
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.dishes {
  /*菜品列表容器*/
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.dish-item {
  /*菜表样式*/
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: 0.3s ease;
}

.dish-item:hover {
  /*菜表悬浮样式*/
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* 调整阴影效果 */
}

.dish-image {
  /*菜品图片容器*/
  height: 150px;
  margin-bottom: 10px;
  overflow: hidden;
}

.dish-image img {
  /*菜品图片样式*/
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dish-name {
  /*菜品名样式*/
  font-size: 16px;
  font-weight: bold;
}
/*页面右部大容器end*/

/*菜品模态框样式begin*/
.modal-container {
  /*菜品模态框大容器*/
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-content {
  /*模态框样式*/
  display: flex;
  align-items: center;
  justify-content: center;
  width: 800px;
  height: 600px;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
}

.modal-dish-image{
  /*模态框图片区域*/
  width: 50%;
  height: 100%;
  border-right: black solid 1px;
}

.modal-dish-image img{
  /*模态框图片样式*/
  width: 100%;
  height: 100%;
}

.modal-dish-details {
  /*模态框信息区域*/
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.price-container {
  /*模态框价格容器*/
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.price {
  /*模态框价格样式*/
  font-size: 18px;
  font-weight: bold;
}

.button-container {
  /*模态框按钮容器*/
  display: flex;
  justify-content: space-between;
}

.quantity-container {
  /*模态框增删按钮容器*/
  display: flex;
  align-items: center;
}

.action-buttons {
  /*模态框关闭选购按钮容器*/
  display: flex;
}

.quantity {
  /*模态框选购数量样式*/
  margin: 0 10px; /* 添加一些间距 */
}

.modal-button {
  /* 样式化按钮 */
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #850220;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.modal-button:hover {
  /*模态框按钮悬浮样式*/
  background-color: #690124;
}
/*菜品模态框样式begin*/

.cart {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.cart-items {
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-details {
  flex: 1;
}

.item-actions button {
  margin-left: 5px;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-total p {
  font-weight: bold;
}

.cart-total button {
  padding: 10px;
  background-color: #850220;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
