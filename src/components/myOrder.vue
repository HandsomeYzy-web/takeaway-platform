<template>
  <h2 class="order-title">订单详情</h2>
  <div class="myOrder" v-for="myOrder in myOrders" :key="myOrder.orderNum">
    <div class="order-info">
      <div class="order-field">
        <span class="field-label">订单号:</span>
        <span class="field-value">{{ myOrder.orderNum }}</span>
      </div>

      <div class="order-field">
        <span class="field-label">下单时间:</span>
        <span class="field-value">{{ myOrder.orderNum }}</span>
      </div>

      <div class="order-field">
        <span class="field-label">收货人:</span>
        <span class="field-value">{{ myOrder.name }}</span>
      </div>

      <div class="order-field">
        <span class="field-label">手机号:</span>
        <span class="field-value">{{ myOrder.phoneNum }}</span>
      </div>

      <div class="order-field">
        <span class="field-label">收货地址:</span>
        <span class="field-value">{{ myOrder.address }}</span>
      </div>

      <div class="order-field">
        <span class="field-label">订单状态</span>
        <span class="field-value">{{ getStatusLabel(myOrder.status) }}</span>
      </div>
    </div>

    <h3 class="items-title">所选购的菜品</h3>

    <ul class="order-items">
      <li v-for="item in myOrder.items" :key="item.menuId" class="item">
        <div class="item-name">{{ item.menuName }}</div>
        <div class="item-quantity">x {{ item.quantity }}</div>
      </li>
    </ul>

    <div class="total-amount">
      <span class="field-label">总金额:</span>
      <span class="field-value">{{ myOrder.totalPrice }}元</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";
export default {
  name: "myOrder",
  data() {
    return {
      username: window.localStorage.getItem('phoneNum'),
      myOrders:[

      ]
    };
  },
  methods: {
    getStatusLabel(status) {
      if (status === 0) {
        return "未接单";
      } else if (status === 1) {
        return "配送中";
      } else if (status === 2) {
        return "已完成";
      }
      return "";
    },
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:8080/getMyOrder', {params: {username: this.username}});
      const responseData = response.data;
      const groupedData = responseData.reduce((result, order) => {
        const existingOrder = result.find(item => item.orderNum === order.orderNum);
        if (existingOrder) {
          existingOrder.items.push({
            menuId: order.menuId,
            menuName: order.menuName,
            quantity: order.quantity
          });
        } else {
          result.push({
            orderNum: order.orderNum,
            orderTime: order.orderTime,
            name: order.name,
            phoneNum: order.phoneNum,
            address: order.address,
            status: order.status,
            totalPrice: order.totalPrice,
            items: [{
              menuId: order.menuId,
              menuName: order.menuName,
              quantity: order.quantity
            }]
          });
        }
        return result;
      }, []);
      this.myOrders = groupedData;
      console.log(this.myOrders)
    } catch (error) {
      ElMessage ({
        type: "error",
        message: "订单信息获取失败，请稍后重试！"
      });
    }
  }

};
</script>

<style scoped>
.myOrder {
  margin-top: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

.order-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.order-info {
  margin-bottom: 20px;
}

.order-field {
  margin-bottom: 10px;
}

.field-label {
  font-weight: bold;
  margin-right: 10px;
}

.field-value {
  color: #888;
}

.items-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.order-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
}

.item-name {
  flex: 1;
}

.item-quantity {
  margin-left: 10px;
  font-weight: bold;
}

.total-amount {
  margin-top: 20px;
  font-weight: bold;
}
</style>
