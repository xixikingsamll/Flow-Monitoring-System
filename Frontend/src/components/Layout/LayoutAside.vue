<template>
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
    >
        <el-menu-item index="1">
          <span>Navigator Two</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span>Navigator Two</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span>Navigator Three</span>
        </el-menu-item>
        <el-menu-item index="4">
          <span>Navigator Four</span>
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