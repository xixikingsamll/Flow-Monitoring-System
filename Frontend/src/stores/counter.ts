import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

// 记录消耗的流量
export const useCounterFlow = defineStore('counterFlow', () => {
  const flow = ref(0)

   // 定义更新 flow 的方法
  const setFlow = (newFlow: number) => {
    flow.value = newFlow;
  };

  return { flow,setFlow }
})
