<template>
  <div class="is-background">
    <div class="login-container">
      <h2>登录</h2>
      <div class="role-options">
        <div class="role-option" :class="{ active: selectedRole === 'user' }" @click="select('user')">用户</div>
        <div class="role-option" :class="{ active: selectedRole === 'delivery' }" @click="select('delivery')">外卖员</div>
        <div class="role-option" :class="{ active: selectedRole === 'admin' }" @click="select('admin')">管理员</div>
      </div>

      <form class="form-container" @submit.prevent="login">
        <div v-if="selectedRole === 'user'">
          <label for="phoneNumber">手机号：</label>
          <input type="text" id="phoneNumber" v-model="phoneNumber" class="input-field">
        </div>
        <div v-if="selectedRole === 'delivery' || selectedRole === 'admin'">
          <label for="username">用户名：</label>
          <input type="text" id="username" v-model="username" class="input-field">
          <label for="password">密码：</label>
          <input type="password" id="password" v-model="password" class="input-field">
        </div>

        <input class="login-button" type="submit" value="登录">
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";
export default {
  name: "LoginRegister",
  data() {
    return {
      selectedRole: 'user',
      phoneNumber: '',
      username: '',
      password: ''
    };
  },
  methods: {
    select(role) {
      this.selectedRole = role;
      if (role === 'user') {
        this.phoneNumber = '';
      } else {
        this.username = '';
        this.password = '';
      }
    },
    login() {
      const api = axios.create({ baseURL: 'http://localhost:8080' });
      if (this.selectedRole === 'user') {
        // 用户登录逻辑
        if (!this.phoneNumber) {
          ElMessage({
            type: "error",
            message: "请输入手机号！"
          });
        } else {
          api.post('/login', { username: this.phoneNumber, type: this.selectedRole})
              .then(response => {
                // 处理登录成功逻辑
                console.log('用户登录成功！');
                // noinspection JSUnresolvedFunction
                //将信息保存到本地
                localStorage.setItem('phoneNum',this.phoneNumber);
                this.$router.push('/user')
                // 在这里进行跳转逻辑，例如使用路由进行页面跳转
              })
              .catch(error => {
                // 处理登录失败逻辑
                console.error('用户登录失败：', error);
                ElMessage({
                  type: "error",
                  message: "登录失败，请稍后重试！"
                });
              });
        }
      } else if (this.selectedRole === 'delivery') {
        // 外卖员登录逻辑
        if (!this.username || !this.password) {
          ElMessage({
            type: "error",
            message: "请输入用户名或密码！"
          });
        } else {
          api.post('/login', { username: this.username, password: this.password, type: this.selectedRole})
              .then(response => {
                // 处理登录成功逻辑
                console.log('外卖员登录成功！');
                // 在这里进行跳转逻辑，例如使用路由进行页面跳转
                localStorage.setItem('delivery',this.username);
                this.$router.push('/delivery')
              })
              .catch(error => {
                // 处理登录失败逻辑
                console.error('外卖员登录失败：', error);
                ElMessage({
                  type: "error",
                  message: "登录失败，请稍后重试！"
                });
              });
        }
      } else if (this.selectedRole === 'admin') {
        // 管理员登录逻辑
        if (!this.username || !this.password) {
          ElMessage({
            type: "error",
            message: "请输入用户名或密码！"
          });
        } else {
          api.post('/login', {username: this.username, password: this.password, type: this.selectedRole})
              .then(response => {
                  // 处理登录成功逻辑
                  console.log('管理员登录成功！');
                  console.log(response);
                  //将信息保存到本地
                  localStorage.setItem('phoneNum',this.phoneNumber);
                  this.$router.push('/HomeView')

                  // 在这里进行跳转逻辑，例如使用路由进行页面跳转
              })
              .catch(error => {
                // 处理请求异常
                console.error('管理员登陆失败：', error);
                ElMessage({
                  type: "error",
                  message: "登陆失败，请稍后重试！"
                });
              });
        }
        }
    }
  }
}
</script>

<style scoped>
.is-background {
  width: 100%;
  height: 100vh;
  background-image: url('public/img/R-C.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

.login-container {
  opacity: 0.9;
  width: 400px;
  height: 400px;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.role-options {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.role-option {
  padding: 10px 20px;
  margin-right: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.role-option.active {
  background-color: #ccc;
}

.form-container {
  margin-bottom: 20px;
}

.input-field {
  box-sizing: border-box;
  width: 100%;
  padding: 8px;
  margin-bottom: 40px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.login-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #850220;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #690124;
}
</style>
<style>
body {
  margin: 0;
  padding: 0;
}
</style>