<template>
  <div style="height: 100%; width: 85%; margin-left: 2%; margin-right: 2%;">
    <div style="margin-top: 1%; padding: 10px;">
      <el-input v-model="searchText" placeholder="请输入搜索内容"></el-input>
    </div>

    <div>
      <el-table :data="pagedData" style="width: 100%" border>
        <el-table-column label="Username" prop="username" />
        <el-table-column label="Password" prop="password" />
        <el-table-column label="Identity" prop="type" />
      </el-table>

      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          :total="filteredData.length"
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
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
      searchText: "",
      currentPage: 1,
      pageSize: 5,
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
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
  },
  methods: {
    handlePageChange(currentPage) {
      this.currentPage = currentPage;
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
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
