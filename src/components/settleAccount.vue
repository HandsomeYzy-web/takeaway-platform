<template>
  <div class="checkout-container">
    <h2>订单结算</h2>
    <div class="order-summary">
      <div class="order-details">
        <div class="order-item" v-for="item in carts" :key="item.id">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-quantity">x {{ item.quantity }}</div>
          <div class="item-price">单价：¥{{ item.price }}</div>
          <div class="item-sumPrice">总价：¥{{ item.quantity * item.price }}</div>
        </div>
      </div>
      <div class="order-total">
        <div class="total-label">总金额：</div>
        <div class="total-price">¥{{ totalPrice }}</div>
      </div>
    </div>
    <div class="shipping-info">
      <h3>收货信息：</h3>
      <div class="from-select">
        <div class="select" @click="isSelectShow = !isSelectShow">选择收货地址</div>
        <div class="select-details" v-if="isSelectShow">
          <div class="select-details-item" v-for="address in addresss">
            <p>收货人姓名：{{ address.name }}</p>
            <p>电话号码：{{ address.number }}</p>
            <p>收货地址：{{ address.address }}</p>
            <button class="select-button" @click="selectShippingInfo(address)">选择</button>
          </div>
        </div>
      </div>
      <div class="form-show">
        <div class="form-group">
          <label for="name">收货人姓名：</label>
          <input type="text" id="name" v-model="shippingInfo.name" placeholder="请输入收货人姓名" disabled>
        </div>
        <div class="form-group">
          <label for="phone">电话号码：</label>
          <input type="tel" id="phone" v-model="shippingInfo.number" placeholder="请输入电话号码" disabled>
        </div>
        <div class="form-group">
          <label for="address">收货地址：</label>
          <textarea id="address" v-model="shippingInfo.address" placeholder="请输入收货地址" disabled></textarea>
        </div>
      </div>
      <div class="form-add">
        <div class="add" @click="isAddShow = !isAddShow">新增收货地址</div>
        <div class="add-form" v-if="isAddShow">
          <div class="form-group">
            <label for="newName">收货人姓名：</label>
            <input type="text" id="newName" v-model="newShippingInfo.name" placeholder="请输入收货人姓名">
          </div>
          <div class="form-group">
            <label for="newPhone">电话号码：</label>
            <input type="tel" id="newPhone" v-model="newShippingInfo.number" placeholder="请输入电话号码">
          </div>
          <div class="form-group">
            <label for="newAddress">收货地址：</label>
            <textarea id="newAddress" v-model="newShippingInfo.address" placeholder="请输入收货地址"></textarea>
          </div>
          <button class="add-button" @click="addShippingInfo">提交</button>
        </div>
      </div>
    </div>
    <div class="payment-methods">
      <h3>选择支付方式：</h3>
      <label>
        <input type="radio" name="paymentMethod" value="alipay" v-model="selectedPaymentMethod">
        支付宝
      </label>
      <label>
        <input type="radio" name="paymentMethod" value="wechatpay" v-model="selectedPaymentMethod">
        微信支付
      </label>
      <label>
        <input type="radio" name="paymentMethod" value="banktransfer" v-model="selectedPaymentMethod">
        银行转账
      </label>
    </div>
    <button class="confirm-button" @click="confirmOrder">确认订单</button>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
  name: "settleAccount",
  data() {
    return {
      username: window.localStorage.getItem("phoneNum"),
      selectedPaymentMethod: "",
      carts: [],
      addresss: [

      ],
      totalPrice: undefined,
      isSelectShow: false,
      isAddShow: false,
      shippingInfo: {
        username: this.username,
        number: "",
        name: "",
        address: ""
      },
      newShippingInfo: {
        username: this.username,
        number: "",
        name: "",
        address: ""
      }
    };
  },
  methods: {
    getNoeDate() {
      let date = new Date();
      const DD = String(date.getDate()).padStart(2, '0'); // 获取日
      const MM = String(date.getMonth() + 1).padStart(2, '0'); //获取月份，1 月为 0
      const yyyy = date.getFullYear(); // 获取年

      const hh =  String(date.getHours()).padStart(2, '0');       //获取当前小时数(0-23)
      const mm = String(date.getMinutes()).padStart(2, '0');     //获取当前分钟数(0-59)
      const ss = String(date.getSeconds()).padStart(2, '0');     //获取当前秒数(0-59)

      date = yyyy + '.' + MM + '.' + DD + ' ' + hh + ':' + mm + ':' + ss;
      return date;
    },
    confirmOrder() {
      if (this.selectedPaymentMethod === "") {
        ElMessage({
          type: "error",
          message: "请选择支付方式！"
        });
      } else if (!this.validateShippingInfo()) {
        ElMessage({
          type: "error",
          message: "请填写完整的收货信息！"
        });
      } else {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        const orderNum = randomNumber + this.username.substring(3,7);
        const order = {username: this.username ,orderNum: orderNum, status: 0 ,totalPrice: this.totalPrice, orderTime: this.getNoeDate() , phoneNum: this.shippingInfo.number , name: this.shippingInfo.name , address: this.shippingInfo.address};
        const orderdetails = this.carts.map(item => ({
          orderNum: orderNum,
          menuId: item.menuId,
          quantity: item.quantity
        }));
        const api = axios.create({baseURL: "http://localhost:8080" });
        api.delete('/deleteCarts',{params:{username:this.username}})
            .then(response =>{
              api.post('/insertOrder',order)
                  .then(response =>{
                    api.post('/insertOrderDetails',orderdetails)
                        .then(response =>{
                          alert("订单已确认，欢迎再次购买！");
                          this.$router.push('/user')
                        }).catch(error =>{
                          ElMessage({
                            type: "error",
                            message: "订单处理失败，请稍后重试！"
                      });
                    })
                  }).catch(error =>{
                    ElMessage({
                      type: "error",
                      message: "订单处理失败，请稍后重试！"
                });
              })
            })
            .catch(error =>{
              ElMessage({
                type: "error",
                message: "订单处理失败，请稍后重试！"
              });
        })
      }
    },
    validateShippingInfo() {
      return (
          this.shippingInfo.name !== "" &&
          this.shippingInfo.number !== "" &&
          this.shippingInfo.address !== ""
      );
    },
    selectShippingInfo(address) {
      this.shippingInfo = address;
      ElMessage({
        type: "success",
        message: "操作成功！"
      });
    },
    addShippingInfo() {
      const api = axios.create({ baseURL: "http://localhost:8080" });
      if(this.newShippingInfo.name === "" || this.newShippingInfo.address === "" || this.newShippingInfo.number === ""){
        ElMessage({
          type: "error",
          message: "请输入收货信息！"
        });
      } else {
        api.post('/api/address/add',{username: this.username, number:this.newShippingInfo.number , name:this.newShippingInfo.name , address:this.newShippingInfo.address})
            .then(response =>{
              this.addresss.push(this.newShippingInfo);
              this.shippingInfo = this.newShippingInfo;
              this.newShippingInfo = {
                name: "",
                number: "",
                address: ""
              };
              ElMessage({
                type: "success",
                message: "操作成功！"
              });
            })
            .catch(error => {
              ElMessage({
                type: "error",
                message: "添加购物车失败，请稍后重试！"
              });
            });
      }
    },
  },

  async mounted() {
    const api = axios.create({ baseURL: "http://localhost:8080" });
    try {
      const response = await api.get("/getCarts", {
        params: {
          userName: this.username
        }
      });

      // 从后端获取购物车数据和总金额
      this.carts = response.data;
      this.totalPrice = this.carts.reduce(
          (total, item) => total + item.quantity * item.price,
          0
      );
    } catch (error) {
      ElMessage({
        type: "error",
        message: "获取购物车失败，请稍后重试！"
      });
    }
    try {
      const response = await api.get("/api/address/select", {
        params: {
          username: this.username
        }
      });

      this.addresss = response.data;
    } catch (error) {
      ElMessage({
        type: "error",
        message: "获取收货地址失败，请稍后重试！"
      });
    }
  }
};
</script>

<style scoped>
.checkout-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.order-summary {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.item-name {
  flex: 1;
}

.item-quantity,
.item-price,
.item-sumPrice {
  flex-basis: 120px;
  text-align: right;
}

.order-total {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  font-weight: bold;
}

.total-label {
  margin-right: 10px;
}

.select,
.add {
  width: 100%;
  text-align: center;
  background-color: #850220;
  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  box-sizing: border-box;
}

.select-details {
  width: 100%;
  background-color: #eee;
  padding: 10px;
  margin-top: 10px;
  border-radius: 3px;
  box-sizing: border-box;
}

.select-details-item {
  margin-bottom: 5px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 3px;
}

.select-details-item p {
  margin: 0;
}

.select-button,
.add-button {
  padding: 3px 5px;
  background-color: #850220;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 3px;
}

.shipping-info {
  margin-bottom: 20px;
}

.shipping-info h3 {
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  font-weight: bold;
}

input[type="text"],
input[type="tel"],
textarea {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
}

.form-show input,
.form-show textarea {
  cursor: not-allowed;
}

textarea {
  height: 80px;
  resize: vertical;
}

.payment-methods {
  margin-bottom: 20px;
}

.payment-methods h3 {
  margin-bottom: 10px;
}

.confirm-button {
  padding: 10px 20px;
  background-color: #850220;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #690124;
}
</style>
