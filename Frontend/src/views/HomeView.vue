<template>
  <div>
    <stepView v-for="(item, index) in bigTitle" :key="index" :bigTitle="item" :title="title[index]" :description="description[index]"/>
  </div>  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import stepView from '@/components/home/stepView.vue'

const downloadSpeed = ref('0.00'); // 保存下载速度的变量
const latency = ref(0); // 保存网络延迟的变量

const bigTitle = [
  '实时网速',
  '应用端口流量',
  '流量消耗'
]
const title = [
  ['测速接口', '单位转换', '均值', 'socket传值'],
  ['获取应用端口', '流量脚本', 'socket传值'],
  ['记录时间段', '单位转换', 'socket传值']
]

const description = [
  ['在测速网站中分时间段下载一份测试文件来返回当前网速', '将速度单位统一为mbps', '分别对一分钟内、五分钟内和一小时内的网速计算均值', '将数据通过WebSocket传给前端'],
  ['使用netstat脚本获取所有应用端口的信息', '使用typeperf脚本类获取应用端口的字节接收和发送的信息', '将数据通过WebSocket传给前端'],
  ['统计用户近期消耗的流量总量（发送字节+接收字节）', '将流量单位统一为mb', '将数据通过WebSocket传给前端']
]

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
