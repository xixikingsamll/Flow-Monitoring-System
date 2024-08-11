<script setup lang="ts">
import LayoutAside from './components/Layout/LayoutAside.vue';
import LayoutHeader from './components/Layout/LayoutHeader.vue';
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <LayoutHeader />
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <LayoutAside />
        </el-aside>
        <el-main><RouterView /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.aside{
  height: 100vh;
  overflow: hidden;
  border-right: 1px solid #ccc;
}

.header{
  display: flex;
  align-items: center;
}
</style>