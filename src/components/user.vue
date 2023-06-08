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
          <p>原料：{{ selectedDish.raw }}</p>
          <p>介绍：{{ selectedDish.intro }}</p>
        </div>
        <div>
          <div class="price-container">
            <span class="price">单价：¥{{ selectedDish.price }}</span>
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
  </div>
  <div class="cart-container" v-if="carts.length !== 0" @click="isCartOpen =! isCartOpen">
    <div class="cart-label">购物车</div>
    <div class="cart-total">总金额：¥{{totalPrice}}</div>
    <button class="checkout-button" @click="checkout($event)">去结算</button>
  </div>
  <div class="cart" v-if="carts.length !== 0 && isCartOpen">
    <div class="cart-items">
      <div v-for="cart in carts" :key="cart.id" class="cart-item">
        <div class="cart-img">
          <img :src="cart.image" alt="Dish Image">
        </div>
        <div class="cart-details">
          <p>{{ cart.name }}</p>
          <p>价格: ¥{{ cart.price }}</p>
          <p>数量: {{ cart.quantity }}</p>
        </div>
        <div class="cart-actions">
          <button @click="cartIncreaseQuantity(cart)">+</button>
          <button @click="cartDecreaseQuantity(cart)">-</button>
          <button @click="removeCart(cart)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";



export default {
  name: 'Dashboard',
  data() {
    return {
      selectedMenu: null, // 当前选中的菜单项的 ID
      searchQuery: '', //输入框中的内容
      isCartOpen:false,//购物车模态框显示状态
      isModalOpen: false, // 菜品模态框的显示状态
      selectedDish: null, // 当前选中的菜品
      quantity: 0, // 初始化数量为0
      user: {
        name: window.localStorage.getItem('phoneNum'),
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      },
      menuItems: [

      ],
      dishes: [

      ],
      carts: [

      ],
    };
  },
  methods: {
    selectMenu(menuId) {
      this.selectedMenu = menuId;
      this.searchQuery = ''; // 重置搜索框内容
    },

    openModal(dish) {
      this.selectedDish = dish; // 设置当前选中的菜品
      const existingDish =this.carts.find(dish => dish.menu_id === this.selectedDish.id);
      if(existingDish){
        this.quantity = existingDish.quantity;
      }else{
        this.quantity = 0;
      }
      this.isModalOpen = true; // 打开模态框
    },

    closeModal() {
      this.isModalOpen = false; // 关闭模态框
    },

    increaseQuantity() {
      this.quantity++; // 增加数量
    },

    decreaseQuantity() {
      if (this.quantity > 0) {
        this.quantity--; // 减少数量，但不会低于0
      }
    },

    addToCart() {
      const existingDish = this.carts.find(dish => dish.menu_id === this.selectedDish.id);

      if (existingDish) {
        if(this.quantity === 0) {
          this.removeCart(existingDish);
        } else {
          existingDish.quantity = this.quantity;
        }
      } else {
        const newDish = {
          menu_id: this.selectedDish.id,
          name: this.selectedDish.name,
          price: this.selectedDish.price,
          image: this.selectedDish.image,
          quantity: this.quantity
        };
        if(newDish.quantity === 0) {
          newDish.quantity++;
        }
        this.carts.push(newDish);
      }

      this.closeModal();
    },

    cartIncreaseQuantity(cart) {
      cart.quantity++;
    },

    cartDecreaseQuantity(cart) {
      cart.quantity--;
      if(cart.quantity<=0){
        this.removeCart(cart);
      }
    },

    removeCart(cart) {
      const index = this.carts.indexOf(cart);
      if (index > -1) {
        this.carts.splice(index, 1);
      }
      if(this.carts.length === 0){
        this.isCartOpen = false;
      }
    },

    checkout(ev) {
      // 发送购物车信息到后端进行结算
      ev.stopPropagation();
      const api = axios.create({ baseURL: 'http://localhost:8080' });
      let newCarts = [];
      const Num = this.user.name;
      for(let i = 0 ; i < this.carts.length ; i++){
        const newCart = {
          userName: Num,
          menu_id: this.carts[i].menu_id,
          quantity: this.carts[i].quantity
        }
        newCarts.push(newCart);
      }
      console.log(newCarts);
      api.post('/settleCarts',newCarts)
          .then(response => {
            this.$router.push('/settleAccount');
          })


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
    totalPrice() {
      let price = 0;
      for(let i=0 ; i<this.carts.length ; i++){
        price = price+this.carts[i].price*this.carts[i].quantity;
      }
      return price;
    },
  },
  async mounted() {
    const api = axios.create({ baseURL: 'http://localhost:8080' });
    api.get('/getMenu')
        .then(response => {
          this.dishes = response.data;
          const set = new Set();
          this.dishes.forEach(item => {
            set.add(item.label);
          });
          const menuCategories = Array.from(set);
          this.menuItems = menuCategories.map((category, index) => {
            return {
              id: index + 1,
              label: category
            };
          });
        })
        .catch(error => {
          ElMessage({
            type: "error",
            message: "获取菜单失败，请稍后重试！"
          });
        });
    try {
      const response = await api.get("/getCarts", {
        params: {
          userName: this.user.name
        }
      });

      // 从后端获取购物车数据和总金额
      this.carts = response.data;
    } catch (error) {
      ElMessage({
        type: "error",
        message: "获取购物车失败，请稍后重试！"
      });
    }
  },
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
  width: 680px;
  height: 510px;
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
/*菜品模态框样式end*/

.cart-container {
  border: black solid 1px;
  width: 400px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 10px;
}

.cart-label {
  margin-right: 10px;
  font-weight: bold;
}

.cart-total {
  flex: 1;
  text-align: center;
}

.checkout-button {
  padding: 10px 20px;
  background-color: rgba(133, 2, 32, 0.7);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.checkout-button:hover {
  background-color: #690124;
}

.cart {
  border: black solid 1px;
  width: 400px;
  max-height: 500px;
  min-height: 300px;
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(255, 255, 255);
  padding: 10px;
  border-radius: 10px;
  overflow: auto;
  -ms-overflow-style: none;
}

.cart-item{
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;
  margin-bottom: 10px;
}

.cart-img {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
}

.cart-img img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-details{
  width: 200px;
  height: 80px;
  font-size: 16px;
  line-height: 16px;
}
.cart-details :first-child {
  font-size: 18px;
  font-weight: bold;
}

.cart-details p {
  margin-top: 8px;
  margin-bottom: 8px;
}

.cart-actions {
  width: 90px;
  height: 80px;
}
</style>
