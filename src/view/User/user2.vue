<template>
  <div>
    <!-- 最上边 -->
    <top/>
  </div>

  <div>
    <div style="display: flex">
      <!-- 左边 -->
      <cblang />
      <!-- 内容 -->
      <table1 />
    </div>
  </div>

</template>


<script>
//将组件引入进来
import top from '../../components/top.vue'
import cblang from '../../components/cblang.vue'
import nrong from '../stats/nrong.vue'
import table1 from "./table1.vue";
export default {
  name:'user',
  components:{
    top,
    cblang,
    table1
  },

}
</script>

