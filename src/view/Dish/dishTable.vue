<template>
  <div style="height: 100%; width: 85%; margin-left: 2%; margin-right: 2%;">
    <div style="margin-top: 1%; padding: 10px;">
      <el-input v-model="searchText" placeholder="请输入搜索内容"></el-input>
    </div>

    <div>
      <el-button type="primary" @click="showAddDialog = true">新增</el-button>
      <!--      <el-table :data="filteredData" style="width: 100%" border>-->
      <el-table :data="pagedData" style="width: 100%" border>
        <el-table-column label="Name" prop="name"/>
        <el-table-column label="Label" prop="label"/>
        <el-table-column label="Price" prop="price"/>
        <el-table-column label="Intro" prop="intro"/>
        <el-table-column label="Raw" prop="raw"/>
        <el-table-column label="Image" prop="image">
          <template #default="scope">
            <img :src="scope.row.image" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>

        <el-table-column align="right">
          <template #default="scope">
            <el-button size="default" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="default" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
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

      <el-dialog v-model="showAddDialog" title="新增数据">
        <el-form :model="addForm">
          <el-form-item label="Name" :label-width="formLabelWidth">
            <el-input v-model="addForm.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Label" :label-width="formLabelWidth">
            <el-input v-model="addForm.label" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Price" :label-width="formLabelWidth">
            <el-input v-model="addForm.price" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Intro" :label-width="formLabelWidth">
            <el-input v-model="addForm.intro" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Raw" :label-width="formLabelWidth">
            <el-input v-model="addForm.raw" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Image" :label-width="formLabelWidth">
            <el-input v-model="addForm.image" autocomplete="off" />
          </el-form-item>

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
          <el-form-item label="Name" :label-width="formLabelWidth">
            <el-input v-model="editedItem.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Label" :label-width="formLabelWidth">
            <el-input v-model="editedItem.label" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Price" :label-width="formLabelWidth">
            <el-input v-model="editedItem.price" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Intro" :label-width="formLabelWidth">
            <el-input v-model="editedItem.intro" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Raw" :label-width="formLabelWidth">
            <el-input v-model="editedItem.raw" autocomplete="off"/>
          </el-form-item>

          <el-form-item label="Image" :label-width="formLabelWidth">
            <el-input v-model="editedItem.image" autocomplete="off" />
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
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      filterTableData: [],
      editedIndex: -1,
      editedItem: {
        id: "",
        name: "",
        label: "",
        price: "",
        intro: "",
        raw: "",
        image: "",
      },
      searchText: "",
      showAddDialog: false,
      showEditDialog: false,
      addForm: {
        name: "",
        label: "",
        price: "",
        intro: "",
        raw: "",
        image: ""
      },
      formLabelWidth: "120px",
      currentPage: 1,
      pageSize: 5,
    };
  },
  computed: {
    filteredData() {//查询
      if (!this.searchText) {
        return this.filterTableData;
      }
      const keyword = this.searchText.toLowerCase();
      return this.filterTableData.filter(item => {
        return item.name.toLowerCase().includes(keyword);
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


    handleDelete(index, row) {//删除
      const id = row.id;
      const apiUrl = `http://localhost:8080/menu/${id}`;
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
        name: "",
        label: "",
        price: "",
        intro: "",
        raw: "",
        image: ""
      };
      ElMessage({
        showClose: true,
        message: '已取消新增',
      })
    },
    handleAddDialogSave() {//新增
      const newItem = {
        name: this.addForm.name,
        label: this.addForm.label,
        price: this.addForm.price,
        intro: this.addForm.intro,
        raw: this.addForm.raw,
        image: this.addForm.image
      };

      const api = axios.create({baseURL: "http://localhost:8080"});
      api.post("/menu", newItem)
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
        name: "",
        label: "",
        price: "",
        intro: "",
        raw: "",
        image: ""
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
        id: "",
        name: "",
        label: "",
        price: "",
        intro: "",
        raw: "",
        image: ""
      };
      ElMessage({
        showClose: true,
        message: '已取消编辑',
      })
    },
    handleEditDialogSave() {//编辑保存
      const editedItem = {...this.editedItem};
      const id = editedItem.id;
      const apiUrl = `http://localhost:8080/menu/${id}`;

      axios.put(apiUrl, editedItem)
          .then(response => {
            console.log("数据已成功更新", response.data);
            this.filterTableData.splice(this.editedIndex, 1, editedItem);
            this.editedIndex = -1;
            this.editedItem = {
              id: "",
              name: "",
              label: "",
              price: "",
              intro: "",
              raw: "",
              image: ""
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

    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
  },
  mounted() {//加载数据
    const api = axios.create({baseURL: "http://localhost:8080"});
    api
        .get("/menu")
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
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
