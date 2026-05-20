<template>
  <div class="app-container carbon-page">
    <div class="page-header">
      <h2>碳汇数据台账</h2>
      <p class="page-desc">数据接入与核算结果统一管理</p>
    </div>
    <el-row :gutter="16" class="stat-row">
      <el-col :span="4" v-for="s in overviewStats" :key="s.label">
        <div class="stat-card">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card highlight">
          <div class="stat-value">{{ overview.totalCarbon }}</div>
          <div class="stat-label">累计碳汇量 (tCO₂)</div>
        </div>
      </el-col>
    </el-row>
    <el-card class="section-card">
      <div slot="header"><span>数据上传</span></div>
      <el-form :inline="true" size="small">
        <el-form-item label="数据源类型">
          <el-select v-model="uploadType" style="width: 140px">
            <el-option label="Excel" value="excel" />
            <el-option label="栅格影像" value="raster" />
            <el-option label="矢量图层" value="vector" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="uploadType === 'excel'" label="翻译表码">
          <el-select v-model="translationCode" placeholder="请选择" style="width: 180px">
            <el-option v-for="o in translationOptions" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-upload drag action="#" :auto-upload="false" class="upload-area">
        <i class="el-icon-upload" />
        <div class="el-upload__text">拖拽或点击上传 XLSX / XLS / CSV</div>
      </el-upload>
      <div class="upload-actions">
        <el-button size="small">模板</el-button>
        <el-button size="small">清空</el-button>
      </div>
    </el-card>
    <ledger-section v-for="block in dataBlocks" :key="block.key" :block="block" />
  </div>
</template>

<script>
import { getLedgerOverview, getLedgerTranslationOptions, getLedgerExcel, getLedgerRaster, getLedgerVector } from '@/api/carbon/ledger'
import LedgerSection from './LedgerSection'

export default {
  name: 'CarbonLedger',
  components: { LedgerSection },
  data() {
    return {
      overview: {},
      translationOptions: [],
      uploadType: 'excel',
      translationCode: '',
      dataBlocks: []
    }
  },
  computed: {
    overviewStats() {
      const o = this.overview
      return [
        { label: '共', value: (o.totalCount || 0) + ' 条' },
        { label: '已核算', value: o.accountedCount || 0 },
        { label: '核算中', value: o.accountingCount || 0 },
        { label: '失败', value: o.failedCount || 0 }
      ]
    }
  },
  created() {
    this.loadAll()
  },
  methods: {
    loadAll() {
      getLedgerOverview().then(res => { this.overview = res.data })
      getLedgerTranslationOptions().then(res => { this.translationOptions = res.data })
      Promise.all([
        getLedgerExcel().then(res => res.data),
        getLedgerRaster().then(res => res.data),
        getLedgerVector().then(res => res.data)
      ]).then(([excel, raster, vector]) => {
        this.dataBlocks = [
          { key: 'excel', ...excel },
          { key: 'raster', ...raster },
          { key: 'vector', ...vector }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';
.highlight .stat-value { color: #0f5c36; }
.upload-area { margin: 12px 0; }
.upload-actions { margin-top: 8px; }
</style>
