<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index" :to="item.path">
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 生成面包屑数据
const breadcrumbItems = computed(() => {  
  const matched = route.matched
  const items = matched.map((item) => {
    return {
      path: item.path,
      label: item.meta.breadcrumbLabel,
    }
  })  
  return items
})
</script>