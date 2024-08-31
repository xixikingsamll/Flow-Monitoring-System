<template>
    <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
    >
        <el-menu-item index="1" @click="$router.push('/MonitorView')">
          <span>实时监控</span>
        </el-menu-item>
        <el-menu-item index="2" @click="$router.push('/StatisticsView')">
          <span>流量统计</span>
        </el-menu-item>
        <el-menu-item index="3" @click="$router.push('/PredictView')">
          <span>流量预测</span>
        </el-menu-item>
        <el-menu-item index="4" @click="$router.push('/ApplicationView')">
          <span>应用流量</span>
        </el-menu-item>
        <el-menu-item index="5" @click="$router.push('/ReportView')">
          <span>定制报告</span>
        </el-menu-item>
        <el-menu-item index="6" @click="$router.push('/ApplicationView/All')">
          <span>test</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
span{
  width: 100%;
  text-align: center;
}
</style>