<template>
  <div class="flex flex-col items-center justify-center w-full pt-6">
    <div class="w-full text-2xl font-bold">To：User</div>
    <div class="w-full flex flex-row justify-around items-center">
      <div id="main" style="width: 50%; height: 600px; padding-top: 40px;"></div>
      <div class="flex flex-col items-center justify-center w-2/5 gap-6">
        <div class="text-2xl font-bold">您从 {{ time }} 开始进入程序</div>
        <div class="text-2xl font-bold">
          已经消耗了{{ flow }}MB流量
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterFlow } from '@/stores/counter';
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts'

const counterFlow = useCounterFlow()

const flow = ref(0);
const sentByte = ref(0);
const receivedByte = ref(0);
const time = ref()
time.value = counterFlow.time

onMounted(() => {
  let chartDom = document.getElementById('main')
  let myChart = echarts.init(chartDom);

  let option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: sentByte.value, name: '发送字节' },
        { value: receivedByte.value, name: '接收字节' },
      ]
    }
  ]
};
  myChart.setOption(option);

  setInterval(() => {
    flow.value = parseFloat(counterFlow.flow.toFixed(2));
    sentByte.value = parseFloat(counterFlow.sentByte.toFixed(2));
    receivedByte.value = parseFloat(counterFlow.receivedByte.toFixed(2));
    
    myChart.setOption({
      series: [
        {
          data: [
            { value: sentByte.value, name: '发送字节' },
            { value: receivedByte.value, name: '接收字节' },
          ]
        }
      ]
    });
  }, 1000);
})
</script>