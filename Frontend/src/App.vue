<script setup lang="ts">
import LayoutAside from './components/Layout/LayoutAside.vue';
import LayoutHeader from './components/Layout/LayoutHeader.vue';
import LayoutBreadCrumb from './components/Layout/LayoutBreadCrumb.vue';
import { useCounterFlow } from './stores/counter';

import { onMounted, onUnmounted, ref } from 'vue';

let ws;  // 用于server2
let ws2; // 用于server

// 获取 Pinia store 实例
const counterStore = useCounterFlow();

const flow = ref(0)
const sentByte = ref(0)
const receivedByte = ref(0)
const trafficData = ref('')
ws = new WebSocket('ws://localhost:8080');
ws2 = new WebSocket('ws://localhost:3007');

// 定义一个函数来初始化和重新连接 WebSocket
const connectWebSocket = () => {

  ws.onopen = () => {
    console.log('已连接到服务器server2');
  };
  ws2.onopen = () => {
    console.log('已连接到服务器server');
  };

  // 全局获取消耗的流量
  ws.onmessage = (event:any) => {
    const connections = JSON.parse(event.data)
    flow.value = parseFloat(connections.total)
    sentByte.value = parseFloat(connections.sentMB)
    receivedByte.value = parseFloat(connections.receivedMB)
    counterStore.set(flow.value, sentByte.value, receivedByte.value)

  };
  ws.onclose = () => {
    console.log('服务器连接已关闭')
    trafficData.value = '连接已关闭，正在尝试重新连接...'
    setTimeout(connectWebSocket, 3000) // 尝试重新连接
  };
  ws2.onclose = () => {
    console.log('服务器连接已关闭')
    trafficData.value = '连接已关闭，正在尝试重新连接...'
    setTimeout(connectWebSocket, 3000) // 尝试重新连接
  };

  ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
  };
  ws2.onerror = (error) => {
    console.error('WebSocket 错误:', error);
  };
};

// 使用生命周期钩子在组件挂载时初始化 WebSocket 连接
onMounted(() => {
  connectWebSocket();
});

// 使用生命周期钩子在组件卸载时关闭 WebSocket 连接
onUnmounted(() => {
  if (ws) ws.close();
  if (ws2) ws2.close();
});
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
        <el-main>
          <LayoutBreadCrumb />
          <RouterView />
        </el-main>
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