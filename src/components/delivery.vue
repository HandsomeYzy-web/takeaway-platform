<template>
  <div class="delivery-container">
    <div class="delivery-top">
      <div class="logo">外卖员接单平台</div>
      <div class="delivery">
        <div class="delivery-image">
          <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="Delivery Image">
        </div>
        <div class="delivery-name">{{delivery}}</div>
      </div>
    </div>
    <div class="content-container">
      <div class="sidebar">
        <ul class="navigation">
          <li :class="{ active: currentTab === '接单平台' }" @click="setCurrentTab('接单平台')" class="item">接单平台</li>
          <li :class="{ active: currentTab === '我的接单' }" @click="setCurrentTab('我的接单')" class="item">我的接单</li>
        </ul>
      </div>
      <div class="content">
        <div v-if="currentTab === '接单平台'">
          <div class="order-list">
            <div v-for="order in platformOrders" :key="order.orderNum" class="order-item">
              <div class="order-card">
                <div class="order-info">
                  <div>订单号：{{ order.orderNum }}</div>
                  <div>收货人: {{ order.name }}</div>
                  <div>手机号：{{ order.phoneNum }}</div>
                  <div>收货地址：{{ order.address }}</div>
                </div>
                <button class="accept-button" @click="acceptOrder(order)">接单</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="currentTab === '我的接单'">
          <div class="order-list">
            <div v-for="order in myOrders" :key="order.orderNum" class="order-item">
              <div class="order-card">
                <div class="order-info">
                  <div>订单号：{{ order.orderNum }}</div>
                  <div>收货人: {{ order.name }}</div>
                  <div>手机号：{{ order.phoneNum }}</div>
                  <div>收货地址：{{ order.address }}</div>
                </div>
                <button class="deliver-button" @click="showConfirmationDialog = true; currentOrder = order">确认送达</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showConfirmationDialog" class="confirmation-dialog">
    <div class="dialog-content">
      <p>确定已完成送达吗？</p>
      <div class="dialog-buttons">
        <button class="confirm-button" @click="confirmDeliveryDialog">确认</button>
        <button class="cancel-button" @click="cancelDeliveryDialog">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "delivery",
  data() {
    return {
      delivery:  window.localStorage.getItem('delivery'),
      currentTab: '接单平台',
      showConfirmationDialog: false,
      currentOrder: null,
      platformOrders: [

      ],
      myOrders: [

      ]
    };
  },
  methods: {
    setCurrentTab(tab) {
      this.currentTab = tab;
    },
    acceptOrder(order) {
      const index = this.platformOrders.findIndex(item => item.orderNum === order.orderNum);
      if (index !== -1) {
        const api = axios.create({ baseURL: 'http://localhost:8080'});
        console.log(order.orderNum);
        api.post('/checkOrder',{orderNum:order.orderNum,delivery:this.delivery})
            .then(response =>{
              this.platformOrders.splice(index, 1);
              this.myOrders.push(order);
              ElMessage ({
                type: "success",
                message: "接单成功！"
              });
            }).catch(error =>{
              ElMessage({
                type: "error",
                message: "接单失败，请稍后重试！"
          });
        })
      }
    },
    confirmDeliveryDialog() {
      const index = this.myOrders.findIndex(item => item.orderNum === this.currentOrder.orderNum);
      if (index !== -1) {
        const api = axios.create({ baseURL: 'http://localhost:8080'});
        api.post('/checkDeliver',{orderNum:this.currentOrder.orderNum,delivery:this.delivery})
            .then(response =>{
              this.myOrders.splice(index, 1);
              ElMessage ({
                type: "success",
                message: "订单处理成功！"
              });
            }).catch(error =>{
          ElMessage({
            type: "error",
            message: "订单处理失败，请稍后重试！"
          });
        })

      }
      this.showConfirmationDialog = false;
    },
    cancelDeliveryDialog() {
      this.showConfirmationDialog = false;
    }
  },
  async mounted() {
    const api = axios.create({ baseURL: 'http://localhost:8080' });
    api.get('/getOrders')
        .then(response =>{
          this.platformOrders = response.data;
          ElMessage ({
            type: "success",
            message: "订单拉取成功！"
          });
        }).catch(error =>{
          ElMessage ({
            type: "error",
            message: "订单拉取失败，请稍后重试！"
      });
    });
    api.get('/getOrder',{params:{delivery: this.delivery}})
        .then(response =>{
          this.myOrders = response.data;
          ElMessage ({
            type: "success",
            message: "我的订单拉取成功！"
          });
        }).catch(error =>{
          ElMessage ({
            type: "error",
            message: "我的订单拉取失败，请稍后重试！"
      });
    })
  }
};
</script>

<style scoped>
.delivery-container {
  width: 100%;
  height: 100vh;
  background-color: #f0f0f0;
}

.delivery-top {
  height: 60px;
  background-color: #545c64;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  font-size: 30px;
  line-height: 60px;
  color: #fff;
}

.delivery {
  display: flex;
  align-items: center;
}

.delivery-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.delivery-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.delivery-name {
  color: #fff;
  font-size: 18px;
}

.content-container {
  display: flex;
  height: calc(100% - 60px);
}

.sidebar {
  background-color: #545c64;
  width: 200px;
  padding: 20px;
}

.navigation {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.item {
  color: #fff;
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.item.active {
  background-color: #690124;
}

.item:hover {
  background-color: #690124;
}

.content {
  flex: 1;
  background-color: #fff;
  padding: 20px;
}

.order-list {
  display: flex;
  flex-wrap: wrap;
}

.order-item {
  flex-basis: calc(33% - 20px);
  height: 210px;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
  transition: 0.3s ease;
}

.order-item:hover {
  transform: scale(1.05);
}

.order-card {
  background-color: #f0f0f0;
  border-radius: 6px;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}

.order-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.accept-button,
.deliver-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #690124;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
}

.accept-button:hover,
.deliver-button:hover {
  background-color: #850220;
}

.confirmation-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.dialog-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dialog-content p {
  margin-bottom: 10px;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
}

.confirm-button,
.cancel-button {
  padding: 5px 10px;
  font-size: 14px;
  background-color: #690124;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:hover,
.cancel-button:hover {
  background-color: #850220;
}
</style>
