<script setup lang="ts">
import { useCounterFlow } from '@/stores/counter';
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts'

// 消耗的流量
const flow = ref(0);
const sentByte = ref(0);
const receivedByte = ref(0);
let timer: number | undefined;

const flowArray:number[] = []
const sentByteArray:number[] = []
const receivedByteArray:number[] = []

onMounted(() => {
  // 初始化 ECharts 实例
  let chartDom = document.getElementById('main');
  let chartDom1 = document.getElementById('main1');
  let chartDom2 = document.getElementById('main2');
  let myChart = echarts.init(chartDom);
  let myChart1 = echarts.init(chartDom1);
  let myChart2 = echarts.init(chartDom2);

  // 定义 ECharts 配置项
  let option = {
    title: {
      text: '总流量'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value'
    },
    legend: {
        data: ['总流量']
    },
    tooltip: {
      trigger: 'axis',       // 触发类型，'axis' 表示跟随坐标轴
      axisPointer: {         // 指示器设置
        type: 'shadow'       // 指示器类型，'shadow' 表示阴影指示器
      },
    },
    series: [
      {
        data: [...flowArray],
        type: 'line',
        areaStyle: {}
      }
    ]
  };

  let option1 = {
    title: {
      text: '发送字节'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    tooltip: {
      trigger: 'axis',       // 触发类型，'axis' 表示跟随坐标轴
      axisPointer: {         // 指示器设置
        type: 'shadow'       // 指示器类型，'shadow' 表示阴影指示器
      },
    },
    yAxis: {
      type: 'value'
    },
    legend: {
      data: ['发送字节']
    },
    series: [
      {
        data: [...sentByteArray],
        type: 'line',
        areaStyle: {}
      }
    ]
  };

  let option2 = {
    title: {
      text: '接收字节'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    tooltip: {
      trigger: 'axis',       // 触发类型，'axis' 表示跟随坐标轴
      axisPointer: {         // 指示器设置
        type: 'shadow'       // 指示器类型，'shadow' 表示阴影指示器
      },
    },
    yAxis: {
      type: 'value'
    },
    legend: {
      data: 'faso'
    },
    series: [
      {
        data: [sentByteArray],
        type: 'line',
        areaStyle: {}
      }
    ]
  };

  // 初始化 ECharts 配置
  myChart.setOption(option);
  myChart1.setOption(option1);
  myChart2.setOption(option2);

  // 每秒更新数据
  timer = setInterval(() => {
    const counterFlow = useCounterFlow();
    flow.value = parseFloat(counterFlow.flow.toFixed(2));
    sentByte.value = parseFloat(counterFlow.sentByte.toFixed(2));
    receivedByte.value = parseFloat(counterFlow.receivedByte.toFixed(2));

    flowArray.push(flow.value);
    sentByteArray.push(sentByte.value);
    receivedByteArray.push(receivedByte.value);

    const minFlow = Math.min(...flowArray);
    const minSentByte = Math.min(...sentByteArray);
    const minReceivedByte = Math.min(...receivedByteArray);

    if (flowArray.length > 23) {
      flowArray.shift();
    }

    if (sentByteArray.length > 12) {
      sentByteArray.shift();
      receivedByteArray.shift();
    }

    // 更新 ECharts 数据集的 `source`
    myChart.setOption({
      series: [
        {
          data: [...flowArray],
          type: 'line',
          areaStyle: {}
        }
      ],
      yAxis: {
        min: minFlow,
        name: '单位：MB'
      }
    });

    myChart1.setOption({
      series: [
        {
          data: [...sentByteArray],
          type: 'line',
          areaStyle: {}
        }
      ],
      yAxis: {
        min: minSentByte,
        name: '单位：MB'
      }
    });

    myChart2.setOption({
      series: [
        {
          data: [...receivedByteArray],
          type: 'line',
          areaStyle: {}
        }
      ],
      yAxis: {
        min: minReceivedByte,
        name: '单位：MB'
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
  <div class="w-full flex justify-center items-center h-24 font-bold border-b-2">
    <p class="text-4xl">已消耗流量: {{ flow }} MB</p>
  </div>
  <div id="main" style="width: 100%; height: 500px; padding-top: 40px;"></div>
  <div class="w-full flex flex-row justify-around items-center">
    <div id="main1" style="width: 40%; height: 500px; padding-top: 20px;"></div>
    <div id="main2" style="width: 40%; height: 500px; padding-top: 20px;"></div>
  </div>
</template>
