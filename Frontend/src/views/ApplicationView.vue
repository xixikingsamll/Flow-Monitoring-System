<template>
  <div>
    <!-- 可视化 -->
    <div ref="chartContainer" style="width: 100%; height: 300px;" class="flex "></div>

    <!-- 端口表格 -->
    <el-table :data="trafficData" style="width: 100%" height="50vh" class="flex items-center justify-center">
      <el-table-column fixed prop="protocol" label="协议" width="150" />
      <el-table-column prop="localAddress" label="本地地址" width="300" />
      <el-table-column prop="remoteAddress" label="远程地址" width="300" />
      <el-table-column prop="localPort" label="本地端口" width="200" />
      <el-table-column prop="state" label="状态" width="200" />
      <el-table-column prop="pid" label="PID" width="200" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

// 使用 ref 来定义响应式状态
const trafficData = ref();
let ws:any;  // 用于存储 WebSocket 实例

const chartContainer = ref();
const chartInstance = ref();
const defaultXY = new Array(60).fill(0)
const xy = ref({
  timestamps: [...defaultXY],
  sentByte: [...defaultXY],
  receivedByte: [...defaultXY]
});

// 更新数据
const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.setOption({
      xAxis: {
        type: 'category',
        data: xy.value.timestamps
      },
      legend: {
        data: ['发送字节数', '接收字节数']
      },
      yAxis: {
        type: 'value',
        name: '字节数'
      },
      series: [
        {
          name: '发送字节数',
          type: 'line',
          areaStyle: {},
          data: xy.value.sentByte
        },
        {
          name: '接收字节数',
          type: 'line',
          areaStyle: {},
          data: xy.value.receivedByte
        }
      ]
    });
  }
};

// 定义一个函数来初始化和重新连接 WebSocket
const connectWebSocket = () => {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('已连接到服务器');
  };

  ws.onmessage = (event:any) => {
    const connections = JSON.parse(event.data)
    
    trafficData.value = connections.connections  // 更新 trafficData
    let newArr = trafficData.value
    trafficData.value = newArr
    // 添加新的数据点
    const now = new Date().toLocaleTimeString();
    xy.value.timestamps.push(now);
    xy.value.sentByte.push(trafficData.value[0].sentBytes);
    xy.value.receivedByte.push(trafficData.value[0].receivedBytes);

    // 限制数据点数量，保留最新的 60 秒的数据
    if (xy.value.timestamps.length > 60) {
      xy.value.timestamps.shift();
      xy.value.sentByte.shift();
      xy.value.receivedByte.shift();
    }
    updateChart();
  };

  ws.onclose = () => {
    console.log('服务器连接已关闭')
    trafficData.value = '连接已关闭，正在尝试重新连接...'
    setTimeout(connectWebSocket, 3000) // 尝试重新连接
  };

  ws.onerror = (error:any) => {
    console.error('WebSocket 错误:', error);
  };
};

// 使用生命周期钩子在组件挂载时初始化 WebSocket 连接
onMounted(() => {
    // 创建echart节点
  chartInstance.value = echarts.init(chartContainer.value);
  connectWebSocket();
});

// 使用生命周期钩子在组件卸载时关闭 WebSocket 连接
onUnmounted(() => {
  if (ws) ws.close();
});
</script>

<style scoped>
pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
