<template>
  <div style="height: 100%; width: 85%; margin-left: 2%; margin-right: 2%;">
    <div style="margin-top: 1%; padding: 10px;">
      <el-input v-model="searchText" placeholder="请输入搜索内容"></el-input>
    </div>

    <div>
      <el-table :data="filteredData" style="width: 100%" border>
        <el-table-column label="Username" prop="username" />
        <el-table-column label="Password" prop="password" />
        <el-table-column label="Identity" prop="type" />

<!--        <el-table-column align="right">-->
<!--          <template #default="scope">-->
<!--            <template v-if="editedIndex !== scope.$index">-->
<!--&lt;!&ndash;              <el-button size="default" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>&ndash;&gt;-->
<!--              <el-button size="default" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
<!--            </template>-->
<!--&lt;!&ndash;            <template v-else>&ndash;&gt;-->
<!--&lt;!&ndash;              <el-button size="default" @click="handleSave(scope.$index)">保存</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;              <el-button size="default" @click="handleCancel()">取消</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;            </template>&ndash;&gt;-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import axios from "axios";

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
      searchText: ""
    };
  },
  computed: {
    filteredData() {
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
    // handleDelete(index, row) {
    //   const id = row.id;
    //   const apiUrl = `http://localhost:8080/user/${id}`;
    //
    //   axios
    //       .delete(apiUrl)
    //       .then(response => {
    //         console.log("数据已成功删除", response.data);
    //         this.filterTableData.splice(index, 1);
    //       })
    //       .catch(error => {
    //         console.error("请求错误", error);
    //       });
    // },
    // handleEdit(index, row) {
    //   this.editedIndex = index;
    //   this.editedItem = Object.assign({}, row);
    // },
    // handleSave(index) {
    //   if (this.editedIndex === index) {
    //     Object.assign(this.filterTableData[index], this.editedItem);
    //     this.editedIndex = -1;
    //     this.editedItem = {
    //       username: "",
    //       password: "",
    //       identity: ""
    //     };
    //   }
    // },
    // handleCancel() {
    //   this.editedIndex = -1;
    //   this.editedItem = {
    //     username: "",
    //     password: "",
    //     identity: ""
    //   };
    // }
  },
  mounted() {
    const api = axios.create({ baseURL: 'http://localhost:8080' });
    api.get('/user')
        .then(response => {
          this.filterTableData = response.data;
        })
        .catch(error => {
          console.error(error);
        });
  }
};
</script>

<style>
</style>
