<script setup lang="ts">
import { useCounterFlow } from '@/stores/counter';
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts'

type ArrayElement = [string, number, number, number]

// 消耗的流量
const flow = ref(0);
const sentByte = ref(0);
const receivedByte = ref(0);
let timer: number | undefined;
const array: ArrayElement[] = []

onMounted(() => {
  // 初始化 ECharts 实例
  let chartDom = document.getElementById('main');
  let myChart = echarts.init(chartDom);

  // 定义 ECharts 配置项
  let option = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        ['product', '总流量', '接收字节', '发送字节'],
        ...array
      ]
    },
    xAxis: { type: 'category' },
    yAxis: { name: '单位：MB' },
    series: [
      {
        type: 'bar',
        label: {
          show: true, // 显示标签
          position: 'top', // 标签显示在条形的顶部
          formatter: (params: any) => params.value[1], // 显示当前的数值
          fontSize: 12
        }
      },
      {
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => params.value[2],
          fontSize: 12
        }
      },
      {
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => params.value[3],
          fontSize: 12
        }
      }
    ]
  };

  // 初始化 ECharts 配置
  myChart.setOption(option);

  // 每秒更新数据
  timer = setInterval(() => {
    const counterFlow = useCounterFlow();
    flow.value = parseFloat(counterFlow.flow.toFixed(2));
    sentByte.value = parseFloat(counterFlow.sentByte.toFixed(2));
    receivedByte.value = parseFloat(counterFlow.receivedByte.toFixed(2));

    const now = new Date().toLocaleTimeString();
    array.push([now, flow.value, receivedByte.value, sentByte.value,]);

    // 保持数组的最大长度为 10
    if (array.length > 23) {
      array.shift();
    }

    // 更新 ECharts 数据集的 `source`
    myChart.setOption({
      dataset: {
        source: [
          ['product', '总流量', '接收字节', '发送字节'],
          ...array
        ]
      }
    });
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
  <div class="w-full flex justify-center items-center h-48 font-bold border-b-2">
    <p class="text-4xl">已消耗流量: {{ flow }} MB</p>
  </div>
  <div id="main" style="width: 100%; height: 500px; padding-top: 40px;"></div>
</template>
