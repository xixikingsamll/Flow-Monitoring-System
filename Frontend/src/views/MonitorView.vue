<template>
  <div>
    <div class="flex flex-row justify-around items-center w-full pt-10">
      <DataCard color="blue" title="当前下载速度" unit="Mbps" :data="downloadSpeed"/>
      <DataCard color="black" title="延迟" unit="ms" :data="latency"/>
    </div>
    <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
    <div class="flex flex-row justify-around items-center w-full pt-10">
      <DataCard color="blue" title="近一分钟平均网速" unit="Mbps" :data="oneMinute"/>
      <DataCard color="red" title="近五分钟平均网速" unit="Mbps" :data="fiveMinute"/>
      <DataCard color="red" title="近一小时平均网速" unit="Mbps" :data="oneHour"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import DataCard from '@/components/monitor/DataCard.vue';

const downloadSpeed = ref(0); // 保存下载速度的变量
const latency = ref(0); // 保存网络延迟的变量
const oneMinute = ref()
const fiveMinute = ref()
const oneHour = ref()
const chartContainer = ref(null);
const chartInstance = ref();
const defaultXY = new Array(120).fill(0)
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

// 创建 WebSocket 连接
const ws = new WebSocket('ws://localhost:3007');

onMounted(() => {
  // 创建echart节点
  chartInstance.value = echarts.init(chartContainer.value);

  // 当接收到服务器消息时更新下载速度
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    
    downloadSpeed.value = parseFloat(parseFloat(data.downloadSpeed).toFixed(2)); // 更新下载速度
    latency.value = parseInt(data.latency); // 更新延迟
    oneMinute.value = data.result.oneMinute
    fiveMinute.value = data.result.fiveMinute
    oneHour.value = data.result.oneHour

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

// 使用生命周期钩子在组件卸载时关闭 WebSocket 连接
onUnmounted(() => {
  if (ws) ws.close();
});
</script>
