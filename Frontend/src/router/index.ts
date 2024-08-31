import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ApplicationView from '@/views/ApplicationView.vue'
import ReportView from '@/views/ReportView.vue'
import PredictView from '@/views/PredictView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import MonitorView from '@/views/MonitorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{ breadcrumbLabel: 'HomePage' }
    },
    {
      path: '/ApplicationView',
      name: 'app',
      component: ApplicationView,
      meta:{ breadcrumbLabel: '应用流量' },
      children: [
        {
          path: '/ApplicationView/All',
          name: 'all',
          component: ReportView,
          meta:{ breadcrumbLabel: '全部流量' }
        },
      ]
    },
    {
      path: '/ReportView',
      name: 'report',
      component: ReportView,
      meta:{ breadcrumbLabel: '定制报告' }
    },
    {
      path: '/PredictView',
      name: 'predict',
      component: PredictView,
      meta:{ breadcrumbLabel: '流量预测' }
    },
    {
      path: '/StatisticsView',
      name: 'statistics',
      component: StatisticsView,
      meta:{ breadcrumbLabel: '流量统计' }
    },
    {
      path: '/MonitorView',
      name: 'monitor',
      component: MonitorView,
      meta:{ breadcrumbLabel: '实时监控' }
    },
  ]
})

export default router
