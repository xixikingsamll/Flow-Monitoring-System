<script setup lang="ts">
import { useCounterFlow } from '@/stores/counter';
import { ref, onMounted, onUnmounted } from 'vue';

// 消耗的流量
const flow = ref(0);
let timer: number | undefined;

onMounted(() => {
  // 在 onMounted 中启动计时器
  timer = setInterval(() => {
    const counterFlow = useCounterFlow();
    flow.value = parseFloat(counterFlow.flow.toFixed(2));
  }, 1000);
});

// 在组件卸载时清除计时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <div>
    {{ flow }}
  </div>
</template>
