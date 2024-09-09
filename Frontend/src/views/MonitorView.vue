<template>
  <div class="flex justify-between item-center flex-row">
    <div id="main" style="width: 500px; height: 500px; padding-top: 40px;"></div>
    <div class="flex flex-col justify-around items-center w-[1000px]">
      <div class="flex flex-row justify-around items-center w-full pt-10">
        <DataCard color="black" title="当前下载速度" unit="Mbps" :data="downloadSpeed"/>
        <DataCard color="black" title="延迟" unit="ms" :data="latency"/>
      </div>
      <div class="flex flex-row justify-around items-center w-full pt-10 gap-10">
        <DataCard color="red" title="近一分钟平均网速" unit="Mbps" :data="oneMinute"/>
        <DataCard color="red" title="近五分钟平均网速" unit="Mbps" :data="fiveMinute"/>
        <DataCard color="red" title="近一小时平均网速" unit="Mbps" :data="oneHour"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import DataCard from '@/components/monitor/DataCard.vue';

type EChartsOption = echarts.EChartsOption;
const downloadSpeed = ref(0); // 保存下载速度的变量
const latency = ref(0); // 保存网络延迟的变量
const oneMinute = ref()
const fiveMinute = ref()
const oneHour = ref()

// 创建 WebSocket 连接
const ws = new WebSocket('ws://localhost:3007');

onMounted(() => {
  let chartDom = document.getElementById('main')!;
  let option: EChartsOption;
  let myChart = echarts.init(chartDom);
  option = {
    series: [
      {
        type: 'gauge',
        max: 800,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: '#fff',
            width: 4
          }
        },
        axisLabel: {
          color: 'inherit',
          distance: 40,
          fontSize: 20
        },
        detail: {
          valueAnimation: true,
          formatter: '{value} mbps',
          color: 'inherit'
        },
        data: [
          {
            value: 0
          }
        ]
      }
    ]
  };
  // 当接收到服务器消息时更新下载速度
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    
    downloadSpeed.value = parseFloat(parseFloat(data.downloadSpeed).toFixed(2)); // 更新下载速度
    latency.value = parseInt(data.latency); // 更新延迟
    oneMinute.value = data.result.oneMinute
    fiveMinute.value = data.result.fiveMinute
    oneHour.value = data.result.oneHour
  };

  setInterval(function () {
    myChart.setOption<echarts.EChartsOption>({
      series: [
        {
          data: [
            {
              value: downloadSpeed.value.toFixed(2)
            }
          ]
        }
      ]
    });
  }, 1000);

  option && myChart.setOption(option);
});

// 使用生命周期钩子在组件卸载时关闭 WebSocket 连接
onUnmounted(() => {
  if (ws) ws.close();
});
</script>
