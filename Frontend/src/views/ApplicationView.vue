<template>
  <div>
    <h1>实时流量监控</h1>
    <p>接收的字节数: {{ trafficData.received }} B</p>
    <p>发送的字节数: {{ trafficData.sent }} B</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const trafficData = ref({ received: 0, sent: 0 });

onMounted(() => {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    trafficData.value = data;
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
