<template>
  <el-steps class="w-full py-16" :active="title.length" align-start>
    <div class=" w-64"> {{ bigTitle }} </div>
    <el-step v-for="(item, index) in title" :key="index" :title="item" :description="description[index]" />
  </el-steps>
</template>
  
<script lang="ts" setup>
defineProps({
  bigTitle: {
    type: String,
    default: 'Title'
  },
  title: {
    type: Array,
    default: () => [
      'Step 1',
      'Step 2',
      'Step 3'
    ]
  },
  description :  {
    type: Array,
    default : () => [
      'Some description',
      'Some description',
      'Some description'
    ]
  }
})
</script>