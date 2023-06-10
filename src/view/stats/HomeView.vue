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
      <nrong/>
    </div>
  </div>

</template>


<script>
//将组件引入进来
import top from '../../components/top.vue'
import cblang from '../../components/cblang.vue'
import nrong from './nrong.vue'
export default {
  name:'HomeView',
  components:{
    top,
    cblang,
    nrong
  },

}
</script>