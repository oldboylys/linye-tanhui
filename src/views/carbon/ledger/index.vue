<template>
  <div class="app-container carbon-page ledger-page">
    <div class="page-header">
      <h2>碳汇数据台账</h2>
      <p class="page-desc">数据接入与核算结果统一管理</p>
    </div>

    <el-row :gutter="16" class="top-layout-row">
      <el-col :xs="24" :lg="12">
        <el-card class="section-card upload-card" shadow="never">
          <div slot="header"><span>数据上传</span></div>
          <el-form :inline="true" size="small" class="upload-form">
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
            <el-button size="small" icon="el-icon-document">模板</el-button>
            <el-button size="small" icon="el-icon-delete">清空</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="section-card overview-card" shadow="never">
          <div slot="header" class="overview-card-header">
            <span>核算概览</span>
            <span class="overview-sub">
              共 {{ overview.totalCount || 0 }} 条，已核算 {{ overview.accountedCount || 0 }}，核算中 {{ overview.accountingCount || 0 }}，失败 {{ overview.failedCount || 0 }}
            </span>
          </div>
          <el-row :gutter="12" class="overview-metrics">
            <el-col :span="12" :sm="6">
              <div class="metric-box metric-carbon">
                <div class="metric-value">{{ overview.totalCarbon != null ? overview.totalCarbon : '--' }}</div>
                <div class="metric-label">累计碳汇 (tCO₂)</div>
              </div>
            </el-col>
            <el-col :span="12" :sm="6">
              <div class="metric-box metric-done">
                <div class="metric-value">{{ overview.accountedCount || 0 }}</div>
                <div class="metric-label">核算完成</div>
              </div>
            </el-col>
            <el-col :span="12" :sm="6">
              <div class="metric-box metric-pending">
                <div class="metric-value">{{ pendingOrRunningCount }}</div>
                <div class="metric-label">待核算 / 核算中</div>
              </div>
            </el-col>
            <el-col :span="12" :sm="6">
              <div class="metric-box metric-fail">
                <div class="metric-value">{{ overview.failedCount || 0 }}</div>
                <div class="metric-label">核算失败</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar-row">
        <div class="toolbar-left">
          <el-select
            v-model="moduleFilter"
            class="filter-item"
            size="small"
            placeholder="数据模块"
            clearable
          >
            <el-option label="全部模块" value="" />
            <el-option label="Excel（林地资源数据）" value="excel" />
            <el-option label="栅格影像" value="raster" />
            <el-option label="矢量图层" value="vector" />
          </el-select>
          <el-select v-model="statusFilter" class="filter-item" size="small" placeholder="核算状态" clearable>
            <el-option label="全部状态" value="" />
            <el-option label="核算完成" value="done" />
            <el-option label="待核算" value="pending" />
            <el-option label="核算中" value="running" />
            <el-option label="核算失败" value="failed" />
          </el-select>
          <el-input
            v-model="keyword"
            class="search-input"
            size="small"
            clearable
            prefix-icon="el-icon-search"
            placeholder="搜索上传记录..."
          />
        </div>
        <div class="toolbar-right">
          <el-button size="small" icon="el-icon-refresh" @click="loadAll">刷新</el-button>
        </div>
      </div>
    </el-card>

    <ledger-section
      v-for="block in visibleBlocks"
      :key="block.key"
      :block="getDisplayBlock(block)"
      @export-row="row => onExportRow(block.label, row)"
    />
  </div>
</template>

<script>
import { getLedgerOverview, getLedgerTranslationOptions, getLedgerExcel, getLedgerRaster, getLedgerVector } from '@/api/carbon/ledger'
import { downloadLedgerRowCsv } from '@/utils/ledgerExport.js'
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
      dataBlocks: [],
      moduleFilter: '',
      statusFilter: '',
      keyword: ''
    }
  },
  computed: {
    pendingOrRunningCount() {
      const o = this.overview
      const t = o.totalCount || 0
      const a = o.accountedCount || 0
      const f = o.failedCount || 0
      return Math.max(0, t - a - f)
    },
    visibleBlocks() {
      if (!this.moduleFilter) return this.dataBlocks
      return this.dataBlocks.filter(b => b.key === this.moduleFilter)
    }
  },
  created() {
    this.loadAll()
  },
  methods: {
    loadAll() {
      getLedgerOverview().then(res => {
        this.overview = res.data
      })
      getLedgerTranslationOptions().then(res => {
        this.translationOptions = res.data
      })
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
    },
    filterRows(rows) {
      const st = this.statusFilter
      const kw = (this.keyword || '').trim().toLowerCase()
      return rows.filter(r => {
        if (st && r.status !== st) return false
        if (kw && !String(r.fileName || '').toLowerCase().includes(kw)) return false
        return true
      })
    },
    getDisplayBlock(block) {
      const rows = this.filterRows(block.rows)
      const totalCarbon = rows.reduce((sum, r) => sum + (Number(r.carbonValue) || 0), 0)
      const completed = rows.filter(r => r.status === 'done').length
      return {
        ...block,
        rows,
        count: rows.length,
        totalCarbon: Number(totalCarbon.toFixed(1)),
        completed
      }
    },
    onExportRow(blockLabel, row) {
      downloadLedgerRowCsv(blockLabel, row)
      this.$message.success('已导出当前记录')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';

.top-layout-row {
  margin-bottom: 16px;
}

.upload-card .upload-area {
  margin: 12px 0;
}
.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}
.upload-form {
  margin-bottom: 0;
}

.overview-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}
.overview-sub {
  font-size: 12px;
  color: #7a8f86;
  font-weight: normal;
}
.overview-metrics {
  margin-top: 0;
}
.metric-box {
  border: 1px solid #e8f0eb;
  border-radius: 8px;
  padding: 14px 10px;
  text-align: center;
  margin-bottom: 8px;
  background: #fafdfb;
}
.metric-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}
.metric-label {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7c74;
}
.metric-carbon .metric-value {
  color: #1a7f4b;
}
.metric-done .metric-value {
  color: #409eff;
}
.metric-pending .metric-value {
  color: #e6a23c;
}
.metric-fail .metric-value {
  color: #f56c6c;
}

.toolbar-card {
  margin-bottom: 16px;
  border-radius: 8px;
}
.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.toolbar-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.filter-item {
  width: 168px;
}
.search-input {
  width: 220px;
}

@media (max-width: 768px) {
  .filter-item,
  .search-input {
    width: 100%;
  }
}
</style>
