<template>
  <div>
    <stepView />
  </div>  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import stepView from '@/components/home/stepView.vue'

const downloadSpeed = ref('0.00'); // 保存下载速度的变量
const latency = ref('0'); // 保存网络延迟的变量

onMounted(() => {
  // 创建 WebSocket 连接
  const ws = new WebSocket('ws://localhost:3007');

  // 当接收到服务器消息时更新下载速度
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    downloadSpeed.value = parseFloat(data.downloadSpeed).toFixed(2); // 更新下载速度
    latency.value = parseInt(data.latency); // 更新延迟
  };

  ws.onopen = () => {
    console.log('已连接到 WebSocket 服务器');
  };

  ws.onclose = () => {
    console.log('连接已关闭');
  };

  ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
  };
});
</script>
