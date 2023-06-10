<template>
  <div style="height: 100%; width: 85%; margin-left: 2%; margin-right: 2%;">
    <div style="margin-top: 1%; padding: 10px;">
      <el-input v-model="searchText" placeholder="请输入搜索内容"></el-input>
    </div>

    <div>
      <el-button type="primary" @click="showAddDialog = true">新增</el-button>
      <el-table :data="filteredData" style="width: 100%" border>
        <el-table-column label="Username" prop="username" />
        <el-table-column label="Password" prop="password" />
        <el-table-column label="Identity" prop="type" />


        <el-table-column align="right">
          <template #default="scope">
            <!--            <template v-if="editedIndex !== scope.$index">-->
            <el-button size="default" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="default" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <!--            </template>-->
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="showAddDialog" title="新增数据">
        <el-form :model="addForm">
<!--          <el-table-column label="Username" prop="username" />-->
<!--          <el-table-column label="Password" prop="password" />-->
<!--          <el-table-column label="Identity" prop="identity" />-->
          <el-form-item label="Username" :label-width="formLabelWidth">
            <el-input v-model="addForm.username" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Password" :label-width="formLabelWidth">
            <el-input v-model="addForm.password" autocomplete="off"/>
          </el-form-item>
<!--          <el-form-item label="Identity" :label-width="formLabelWidth">-->
<!--            <el-input v-model="addForm.identity" autocomplete="off"/>-->
<!--          </el-form-item>-->
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleAddDialogClose">取消</el-button>
            <el-button type="primary" @click="handleAddDialogSave">保存</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog v-model="showEditDialog" title="编辑数据">
        <el-form :model="editedItem">
          <el-form-item label="Username" :label-width="formLabelWidth">
            <el-input v-model="editedItem.username" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Password" :label-width="formLabelWidth">
            <el-input v-model="editedItem.password" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleEditDialogClose">取消</el-button>
            <el-button type="primary" @click="handleEditDialogSave">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {computed} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      filterTableData: [],
      editedIndex: -1,
      editedItem: {
        username: "",
        password: "",
        type: ""
      },
      searchText: "",
      showAddDialog: false,
      showEditDialog: false,
      addForm: {
        username: "",
        password: "",
        type: ""
      },
      formLabelWidth: "120px"
    };
  },
  computed: {
    filteredData() {//查询
      if (!this.searchText) {
        return this.filterTableData;
      }
      const keyword = this.searchText.toLowerCase();
      return this.filterTableData.filter(item => {
        return item.username.toLowerCase().includes(keyword);
      });
    }
  },
  methods: {
    handleDelete(index, row) {//删除
      const username = row.username;
      const apiUrl = `http://localhost:8080/user/${username}`;

      axios
          .delete(apiUrl)
          .then(response => {
            console.log("数据已成功删除", response.data);
            this.filterTableData.splice(index, 1);
            ElMessage({
              showClose: true,
              message: '数据已成功删除!',
              type: 'success',
            })
          })
          .catch(error => {
            console.error("请求错误", error);
          });
    },
    handleAddDialogClose() {//取消新增
      this.showAddDialog = false;
      this.addForm = {
        username: "",
        password: "",
        type: ""
      };
      ElMessage({
        showClose: true,
        message: '已取消新增',
      })
    },
    handleAddDialogSave() {//新增
      const newItem = {
        username: this.addForm.username,
        password: this.addForm.password,
        type: "delivery",// 将身份字段设为固定值"delivery"
      };

      const api = axios.create({baseURL: "http://localhost:8080"});
      api.post("/user", newItem)
          .then(response => {
            console.log("数据已保存到数据库");
            newItem.id = response.data.id;
            this.filterTableData.push(newItem);
            ElMessage({
              showClose: true,
              message: '数据已成功添加!',
              type: 'success',
            })
          })
          .catch(error => {
            console.error(error);
          });

      this.showAddDialog = false;
      this.addForm = {
        username: "",
        password: "",
        type: ""
      };
    },
    handleEdit(index, row) {//编辑
      this.editedIndex = index;
      this.editedItem = {...row};
      this.showEditDialog = true;
    },
    handleEditDialogClose() {//取消编辑
      this.showEditDialog = false;
      this.editedIndex = -1;
      this.editedItem = {
        username: "",
        password: "",
        type: ""
      };
      ElMessage({
        showClose: true,
        message: '已取消编辑',
      })
    },
    handleEditDialogSave() {//编辑保存
      const editedItem = {...this.editedItem};
      const username = editedItem.username;
      const apiUrl = `http://localhost:8080/user/${username}`;

      axios.put(apiUrl, editedItem)
          .then(response => {
            console.log("数据已成功更新", response.data);
            this.filterTableData.splice(this.editedIndex, 1, editedItem);
            this.editedIndex = -1;
            this.editedItem = {
              username: "",
              password: "",
              type: ""
            };
            this.showEditDialog = false;
            ElMessage({
              showClose: true,
              message: '数据已成功更新!',
              type: 'success',
            })
          })
          .catch(error => {
            console.error("请求错误", error);
          });
    },


  },
  mounted() {//加载数据
    const api = axios.create({baseURL: "http://localhost:8080"});
    api
        .get("/user")
        .then(response => {
          this.filterTableData = response.data.filter(item => item.type === "delivery");//过滤
        })
        .catch(error => {
          console.error(error);
        });
  }
};
</script>

<style>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
