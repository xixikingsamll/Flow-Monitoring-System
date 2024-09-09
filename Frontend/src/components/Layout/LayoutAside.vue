<template>
    <el-menu
        :default-active=active
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
    >
        <el-menu-item index="1" @click="linkto('/', '1')">
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="2" @click="linkto('/MonitorView', '2')">
          <span>实时监控</span>
        </el-menu-item>
        <el-menu-item index="3" @click="linkto('/StatisticsView', '3')">
          <span>流量统计</span>
        </el-menu-item>
        <el-menu-item index="4" @click="linkto('/PredictView', '4')">
          <span>流量预测</span>
        </el-menu-item>
        <el-menu-item index="5" @click="linkto('/ApplicationView', '5')">
          <span>应用流量</span>
        </el-menu-item>
        <el-menu-item index="6" @click="linkto('/ReportView', '6')">
          <span>定制报告</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const active = ref()

const router = useRouter()

const linkto = (path:string, index:string) => {
  active.value = index
  router.push(path)
}
</script>

<style scoped>
span{
  width: 100%;
  text-align: center;
}
</style>