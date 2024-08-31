<template>
  <div>
    <p>当前下载速度: {{ downloadSpeed }} Mbps</p>
    <p>网络延迟: {{ latency }} ms</p>
    <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const downloadSpeed = ref('0.00'); // 保存下载速度的变量
const latency = ref('0'); // 保存网络延迟的变量
const chartContainer = ref(null);
const chartInstance = ref(null);
const defaultXY = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
const xy = ref({
  timestamps: [...defaultXY],
  speeds: [...defaultXY]
});

// 更新数据
const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.setOption({
      xAxis: {
        type: 'category',
        data: xy.value.timestamps
      },
      yAxis: {
        type: 'value',
        name: '下载速度 (Mbps)'
      },
      series: [
        {
          name: '下载速度',
          type: 'line',
          areaStyle: {},
          data: xy.value.speeds
        }
      ]
    });
  }
};

onMounted(() => {
  // 创建echart节点
  chartInstance.value = echarts.init(chartContainer.value);
  // 创建 WebSocket 连接
  const ws = new WebSocket('ws://localhost:3007');

  // 当接收到服务器消息时更新下载速度
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    downloadSpeed.value = parseFloat(data.downloadSpeed).toFixed(2); // 更新下载速度
    latency.value = parseInt(data.latency); // 更新延迟

    // 添加新的数据点
    const now = new Date().toLocaleTimeString();
    xy.value.timestamps.push(now);
    xy.value.speeds.push(downloadSpeed.value);

    // 限制数据点数量，保留最新的 60 秒的数据
    if (xy.value.timestamps.length > 120) {
      xy.value.timestamps.shift();
      xy.value.speeds.shift();
    }
    updateChart();
  };
});
</script>
