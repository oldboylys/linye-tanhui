<template>
  <div class="app-container carbon-page">
    <div class="page-header">
      <h2>碳汇分析</h2>
      <p class="page-desc">基于台账接入数据的多维度碳汇核算分析</p>
    </div>
    <el-alert :title="'已选 ' + summary.selectedCount + ' 个数据集 · ' + summary.totalCarbon + ' tCO₂'" type="success" show-icon :closable="false" class="mb16" />
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card v-for="(group, key) in datasets" :key="key" class="mb16">
          <div slot="header">{{ group.label }} · {{ group.selected }}/{{ group.total }} 项</div>
          <p class="group-carbon">{{ group.carbon }} tCO₂</p>
          <el-checkbox v-for="item in group.items" :key="item.id" v-model="item.selected">{{ item.name }}</el-checkbox>
        </el-card>
        <el-form :inline="true" size="small">
          <el-form-item label="区域"><el-select v-model="region" placeholder="全部区域" style="width:120px"><el-option label="全部区域" value="" /></el-select></el-form-item>
          <el-form-item label="林种"><el-select v-model="species" placeholder="全部林种" style="width:120px"><el-option label="全部林种" value="" /></el-select></el-form-item>
          <el-form-item><el-button type="primary" @click="runAnalysis">分析</el-button></el-form-item>
        </el-form>
      </el-col>
      <el-col :span="16">
        <el-card v-if="result.forestStructure.length">
          <div slot="header">林种结构分析</div>
          <el-table :data="result.forestStructure" size="small">
            <el-table-column prop="name" label="林种" />
            <el-table-column prop="value" label="面积" />
            <el-table-column prop="unit" label="单位" width="80" />
          </el-table>
        </el-card>
        <el-card class="mt16" v-if="result.regionCompare.length">
          <div slot="header">区域碳汇对比</div>
          <el-table :data="result.regionCompare" size="small">
            <el-table-column prop="region" label="区域" />
            <el-table-column prop="carbon" label="碳汇量 (tCO₂)" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAnalysisSummary, getAnalysisDatasets, getAnalysisResult } from '@/api/carbon/analysis'

export default {
  name: 'CarbonAnalysis',
  data() {
    return {
      summary: {},
      datasets: {},
      result: { forestStructure: [], regionCompare: [] },
      region: '',
      species: ''
    }
  },
  created() {
    getAnalysisSummary().then(res => { this.summary = res.data })
    getAnalysisDatasets().then(res => { this.datasets = res.data })
    getAnalysisResult().then(res => { this.result = res.data })
  },
  methods: {
    runAnalysis() {
      getAnalysisResult().then(res => {
        this.result = res.data
        this.$message.success('分析完成')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';
.mb16 { margin-bottom: 16px; }
.mt16 { margin-top: 16px; }
.group-carbon { color: #1a7f4b; font-weight: 600; margin-bottom: 12px; }
.el-checkbox { display: block; margin: 6px 0; }
</style>


