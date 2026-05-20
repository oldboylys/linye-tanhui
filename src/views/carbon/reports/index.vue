<template>
  <div class="app-container carbon-page">
    <div class="page-header">
      <h2>报告中心</h2>
    </div>
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            接入数据
            <el-button type="text" size="mini" @click="selectAll">全选</el-button>
            <el-button type="text" size="mini" @click="clearAll">清空</el-button>
          </div>
          <div v-for="(items, type) in datasets" :key="type" class="dataset-group">
            <p class="group-title">{{ typeLabels[type] }} ({{ selectedCount(type) }}/{{ items.length }})</p>
            <el-checkbox v-for="item in items" :key="item.id" v-model="item.selected">{{ item.name }}</el-checkbox>
          </div>
        </el-card>
        <el-card class="mt16">
          <div slot="header">生成报告</div>
          <el-select v-model="reportType" placeholder="选择报告类型" style="width:100%">
            <el-option v-for="t in reportTypes" :key="t" :label="t" :value="t" />
          </el-select>
          <el-button type="primary" style="width:100%;margin-top:12px" @click="generate">生成报告</el-button>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="12">
          <el-col :span="12" v-for="report in reports" :key="report.id">
            <el-card class="report-card" :class="{ active: current && current.id === report.id }" @click.native="current = report">
              <h4>{{ report.title }}</h4>
              <p>{{ report.date }} · {{ report.type }}</p>
              <el-tag size="mini" type="success">{{ report.status === 'done' ? '已完成' : report.status }}</el-tag>
              <span class="data-count">{{ report.dataCount }} 份数据</span>
            </el-card>
          </el-col>
        </el-row>
        <el-card v-if="current" class="mt16">
          <div slot="header">报告详情</div>
          <h3>{{ current.title }}</h3>
          <p>类型：{{ current.type }} · 日期：{{ current.date }}</p>
          <p>关联数据 {{ current.dataCount }} 份</p>
        </el-card>
        <el-empty v-else description="选择左侧报告查看详情" class="mt16" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getReportsDatasets, getReportsList, getReportTypes } from '@/api/carbon/reports'

export default {
  name: 'CarbonReports',
  data() {
    return {
      datasets: { excel: [], raster: [], vector: [] },
      reports: [],
      reportTypes: [],
      reportType: '',
      current: null,
      typeLabels: { excel: 'Excel', raster: '栅格影像', vector: '矢量图层' }
    }
  },
  created() {
    getReportsDatasets().then(res => { this.datasets = res.data })
    getReportsList().then(res => { this.reports = res.data })
    getReportTypes().then(res => { this.reportTypes = res.data })
  },
  methods: {
    selectedCount(type) {
      return this.datasets[type].filter(i => i.selected).length
    },
    selectAll() {
      Object.keys(this.datasets).forEach(k => this.datasets[k].forEach(i => { i.selected = true }))
    },
    clearAll() {
      Object.keys(this.datasets).forEach(k => this.datasets[k].forEach(i => { i.selected = false }))
    },
    generate() {
      this.$message.success('报告生成任务已提交（Mock）')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';
.mt16 { margin-top: 16px; }
.dataset-group { margin-bottom: 16px; }
.group-title { font-weight: 600; margin-bottom: 8px; }
.el-checkbox { display: block; margin: 4px 0; }
.report-card { cursor: pointer; margin-bottom: 12px; }
.report-card.active { border-color: #1a7f4b; }
.report-card h4 { margin: 0 0 8px; font-size: 14px; }
.data-count { float: right; font-size: 12px; color: #888; }
</style>


