<template>
  <div class="app-container carbon-page carbon-analysis-page">
    <div class="page-header">
      <h2>碳汇分析</h2>
      <p class="page-desc">基于台账接入数据的多维度碳汇核算分析</p>
    </div>

    <!-- 接入数据选择 -->
    <el-card class="section-card select-section" shadow="hover">
      <div slot="header" class="select-header">
        <span class="header-title">
          <i class="el-icon-collection header-title-icon" />
          接入数据选择
        </span>
        <div class="header-actions">
          <el-button type="text" size="small" @click="selectAllGlobal">全选</el-button>
          <el-button type="text" size="small" @click="clearAllGlobal">清空</el-button>
        </div>
      </div>

      <el-row :gutter="16" class="select-columns">
        <el-col :xs="24" :md="8" v-for="meta in groupMeta" :key="meta.key">
          <div class="data-column">
            <div class="column-head">
              <span class="col-icon" :class="meta.iconClass" v-html="meta.svg" />
              <div class="column-title-wrap">
                <div class="column-title">{{ datasets[meta.key].label }}</div>
                <div class="column-sub">{{ stats[meta.key].selected }}/{{ stats[meta.key].total }} 项</div>
              </div>
              <div class="column-mini-actions">
                <el-button type="text" size="mini" @click="selectGroup(meta.key)">全选</el-button>
                <el-button type="text" size="mini" @click="clearGroup(meta.key)">清空</el-button>
              </div>
            </div>
            <div class="item-list">
              <label
                v-for="item in datasets[meta.key].items"
                :key="item.id"
                class="data-item"
                :class="{ checked: item.selected }"
              >
                <el-checkbox v-model="item.selected" @change="onItemToggle" />
                <span class="item-type-ico" :class="meta.fileIcon" />
                <span class="item-name" :title="item.name">{{ item.name }}</span>
                <span class="item-carbon">{{ formatCarbon(item.carbon) }}</span>
              </label>
            </div>

          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 汇总卡片 -->
    <el-row :gutter="16" class="summary-row">
      <el-col :xs="24" :md="8" v-for="meta in groupMeta" :key="'sum-' + meta.key">
        <div class="summary-card" :class="{ active: stats[meta.key].carbon > 0 }">
          <div class="summary-icon-wrap" :class="meta.iconClass">
            <span class="summary-svg" v-html="meta.summarySvg" />
          </div>
          <div class="summary-body">
            <div class="summary-carbon">
              {{ stats[meta.key].carbon > 0 ? formatCarbon(stats[meta.key].carbon) : '0' }} <small>tCO₂</small>
            </div>
            <div class="summary-meta">{{ stats[meta.key].selected }}/{{ stats[meta.key].total }} 已选</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="live-banner">
      <span class="live-dot" />
      实时汇总：已选 <b>{{ totalSelectedCount }}</b> 个数据集 · 合计
      <b>{{ formatCarbon(totalSelectedCarbon) }}</b> tCO₂
    </div>

    <!-- 筛选 + 分析 -->
    <el-card class="section-card filter-card" shadow="never">
      <el-form :inline="true" size="small" class="filter-form">
        <el-form-item label="区域选择">
          <el-select v-model="region" placeholder="全部区域" clearable style="width: 140px">
            <el-option v-for="o in filterOptions.regions" :key="o.value || 'all'" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="林种">
          <el-select v-model="forestType" placeholder="全部林种" clearable style="width: 140px">
            <el-option v-for="o in filterOptions.forestTypes" :key="o.value || 'all'" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="林龄">
          <el-select v-model="forestAge" placeholder="全部林龄" clearable style="width: 140px">
            <el-option v-for="o in filterOptions.forestAges" :key="o.value || 'all'" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-data-analysis" :loading="analyzing" @click="runAnalysis">分析</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图表 2x2 -->
    <el-row :gutter="16" class="charts-grid">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="chart-card-header">
            <span class="chart-title"><i class="el-icon-pie-chart chart-title-icon" />林种结构分析</span>
            <el-tag size="mini" :type="stats.excel.selected ? 'success' : 'info'" effect="plain">{{ tagForest }}</el-tag>
          </div>
          <div ref="chartForest" class="chart-box" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="chart-card-header">
            <span class="chart-title"><i class="el-icon-s-data chart-title-icon" />树龄结构分析</span>
            <el-tag size="mini" type="success" effect="plain">{{ tagTreeAge }}</el-tag>
          </div>
          <div ref="chartTreeAge" class="chart-box" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="chart-card-header">
            <span class="chart-title"><i class="el-icon-s-marketing chart-title-icon" />优势树种分析</span>
            <el-tag size="mini" type="warning" effect="plain">{{ tagSpecies }}</el-tag>
          </div>
          <div ref="chartSpecies" class="chart-box" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="chart-card-header">
            <span class="chart-title"><i class="el-icon-map-location chart-title-icon" />区域碳汇对比</span>
            <el-tag size="mini" type="success" effect="plain">核算结果</el-tag>
          </div>
          <div ref="chartRegion" class="chart-box" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getAnalysisDatasets, getAnalysisFilters, postAnalysisCharts } from '@/api/carbon/analysis'

const GREEN = ['#0f5c36', '#1a7f4b', '#2d9c5a', '#5cb87a', '#8fd4a6', '#c5e9d2']

const SVG_EXCEL = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 12h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>`
const SVG_RASTER = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>`
const SVG_VECTOR = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>`

export default {
  name: 'CarbonAnalysis',
  data() {
    return {
      datasets: {
        excel: { label: '', items: [] },
        raster: { label: '', items: [] },
        vector: { label: '', items: [] }
      },
      filterOptions: { regions: [], forestTypes: [], forestAges: [] },
      region: '',
      forestType: '',
      forestAge: '',
      analyzing: false,
      chartPayload: null,
      charts: { forest: null, treeAge: null, species: null, region: null },
      groupMeta: [
        { key: 'excel', iconClass: 'tone-excel', fileIcon: 'ft-xlsx', svg: SVG_EXCEL, summarySvg: SVG_EXCEL },
        { key: 'raster', iconClass: 'tone-raster', fileIcon: 'ft-img', svg: SVG_RASTER, summarySvg: SVG_RASTER },
        { key: 'vector', iconClass: 'tone-vector', fileIcon: 'ft-shp', svg: SVG_VECTOR, summarySvg: SVG_VECTOR }
      ]
    }
  },
  computed: {
    stats() {
      const g = key => {
        const items = this.datasets[key].items || []
        const selectedItems = items.filter(i => i.selected)
        const carbon = selectedItems.reduce((s, i) => s + (Number(i.carbon) || 0), 0)
        return { selected: selectedItems.length, total: items.length, carbon }
      }
      return { excel: g('excel'), raster: g('raster'), vector: g('vector') }
    },
    totalSelectedCount() {
      return this.stats.excel.selected + this.stats.raster.selected + this.stats.vector.selected
    },
    totalSelectedCarbon() {
      return this.stats.excel.carbon + this.stats.raster.carbon + this.stats.vector.carbon
    },
    tagForest() {
      return this.stats.excel.selected ? `Excel · ${this.stats.excel.selected}项` : '未选择Excel数据'
    },
    tagTreeAge() {
      const n = this.stats.raster.selected + this.stats.vector.selected
      return n ? `栅格 + 矢量 · ${n}项` : '未选择栅格/矢量'
    },
    tagSpecies() {
      const n = this.totalSelectedCount
      return n ? `${n}个数据集` : '请先选择数据'
    }
  },
  created() {
    getAnalysisDatasets().then(res => {
      this.datasets = JSON.parse(JSON.stringify(res.data))
    })
    getAnalysisFilters().then(res => {
      this.filterOptions = res.data
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
      this.setPlaceholderCharts()
    })
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts)
    Object.keys(this.charts).forEach(k => {
      if (this.charts[k]) {
        this.charts[k].dispose()
        this.charts[k] = null
      }
    })
  },
  methods: {
    formatCarbon(v) {
      if (v == null || v === '') return '0'
      const n = Number(v)
      if (Number.isNaN(n)) return String(v)
      return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
    },
    onItemToggle() {},
    selectGroup(key) {
      this.datasets[key].items.forEach(i => { i.selected = true })
    },
    clearGroup(key) {
      this.datasets[key].items.forEach(i => { i.selected = false })
    },
    selectAllGlobal() {
      ;['excel', 'raster', 'vector'].forEach(k => this.selectGroup(k))
    },
    clearAllGlobal() {
      ;['excel', 'raster', 'vector'].forEach(k => this.clearGroup(k))
    },
    initCharts() {
      const refs = [
        ['forest', this.$refs.chartForest],
        ['treeAge', this.$refs.chartTreeAge],
        ['species', this.$refs.chartSpecies],
        ['region', this.$refs.chartRegion]
      ]
      refs.forEach(([k, el]) => {
        if (el && !this.charts[k]) this.charts[k] = echarts.init(el)
      })
    },
    resizeCharts() {
      Object.values(this.charts).forEach(c => c && c.resize())
    },
    setPlaceholderCharts() {
      const hint = '请选择筛选项后点击「分析」'
      const opt = {
        graphic: [{
          type: 'text',
          left: 'center',
          top: 'middle',
          style: { text: hint, fill: '#9aa8a1', fontSize: 13 }
        }]
      }
      Object.values(this.charts).forEach(c => c && c.setOption(opt, true))
    },
    runAnalysis() {
      this.analyzing = true
      postAnalysisCharts({
        region: this.region,
        forestType: this.forestType,
        forestAge: this.forestAge,
        selection: {
          excel: this.stats.excel,
          raster: this.stats.raster,
          vector: this.stats.vector
        }
      })
        .then(res => {
          this.chartPayload = res.data
          this.$nextTick(() => this.applyChartOptions(res.data))
          this.$message.success('分析完成')
        })
        .finally(() => {
          this.analyzing = false
        })
    },
    applyChartOptions(d) {
      if (!d) return
      this.initCharts()

      const baseTooltip = { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.96)', borderColor: '#e8f0eb', textStyle: { color: '#334843' } }

      if (this.charts.forest) {
        const pieData = (d.forestStructure || []).map((item, i) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: GREEN[i % GREEN.length] }
        }))
        this.charts.forest.setOption({
          animationDuration: 800,
          tooltip: { trigger: 'item', formatter: '{b}<br/>{c} hm² ({d}%)' },
          legend: { orient: 'vertical', right: 12, top: 'center', textStyle: { color: '#5a6b62' } },
          series: [{
            type: 'pie',
            radius: ['42%', '68%'],
            center: ['38%', '50%'],
            avoidLabelOverlap: true,
            label: { color: '#334843' },
            data: pieData
          }],
          graphic: []
        }, true)
      }

      if (this.charts.treeAge && d.treeAge) {
        const { categories, area, carbon } = d.treeAge
        this.charts.treeAge.setOption({
          animationDuration: 800,
          tooltip: { ...baseTooltip, axisPointer: { type: 'shadow' } },
          legend: { data: ['面积 hm²', '碳汇量 tCO₂'], bottom: 0, textStyle: { color: '#5a6b62' } },
          grid: { left: 48, right: 24, top: 28, bottom: 52 },
          xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: '#cfe8d9' } }, axisLabel: { color: '#5a6b62' } },
          yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#edf5f0' } }, axisLabel: { color: '#5a6b62' } },
          series: [
            { name: '面积 hm²', type: 'bar', barGap: 0, itemStyle: { color: '#1a7f4b', borderRadius: [4, 4, 0, 0] }, data: area },
            { name: '碳汇量 tCO₂', type: 'bar', itemStyle: { color: '#8fd4a6', borderRadius: [4, 4, 0, 0] }, data: carbon }
          ],
          graphic: []
        }, true)
      }

      if (this.charts.species && d.species) {
        const { categories, area, carbon } = d.species
        this.charts.species.setOption({
          animationDuration: 800,
          tooltip: { ...baseTooltip, axisPointer: { type: 'shadow' } },
          legend: { data: ['面积 hm²', '碳汇量 tCO₂'], bottom: 0, textStyle: { color: '#5a6b62' } },
          grid: { left: 48, right: 24, top: 28, bottom: 52 },
          xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: '#cfe8d9' } }, axisLabel: { color: '#5a6b62', rotate: 28 } },
          yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#edf5f0' } }, axisLabel: { color: '#5a6b62' } },
          series: [
            { name: '面积 hm²', type: 'bar', barGap: 0, itemStyle: { color: '#0f5c36', borderRadius: [4, 4, 0, 0] }, data: area },
            { name: '碳汇量 tCO₂', type: 'bar', itemStyle: { color: '#67d581', borderRadius: [4, 4, 0, 0] }, data: carbon }
          ],
          graphic: []
        }, true)
      }

      if (this.charts.region && d.regionCompare) {
        const rows = [...d.regionCompare].sort((a, b) => a.carbon - b.carbon)
        this.charts.region.setOption({
          animationDuration: 800,
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(255,255,255,0.96)', borderColor: '#e8f0eb' },
          grid: { left: 72, right: 32, top: 16, bottom: 36 },
          xAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#edf5f0' } }, axisLabel: { color: '#5a6b62' } },
          yAxis: { type: 'category', data: rows.map(r => r.region), axisLine: { lineStyle: { color: '#cfe8d9' } }, axisLabel: { color: '#5a6b62' } },
          series: [{
            name: '碳汇量 tCO₂',
            type: 'bar',
            itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#1a7f4b' }, { offset: 1, color: '#5cb87a' }]), borderRadius: [0, 6, 6, 0] },
            data: rows.map(r => r.carbon)
          }],
          graphic: []
        }, true)
      }
      this.resizeCharts()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';

.carbon-analysis-page {
  .section-card {
    border-radius: 12px;
    border: 1px solid #e8f0eb;
    margin-bottom: 16px;
  }

  .select-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-title {
    font-weight: 600;
    color: #1a2e24;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-title-icon {
    color: #1a7f4b;
    font-size: 18px;
  }

  .select-columns {
    margin-top: 4px;
  }

  .data-column {
    border: 1px solid #e8f0eb;
    border-radius: 12px;
    overflow: hidden;
    background: #fafcfb;
    min-height: 380px;
  }

  .column-head {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 12px 10px;
    background: linear-gradient(180deg, #f3faf6 0%, #fafcfb 100%);
    border-bottom: 1px solid #e8f0eb;
  }

  .col-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 6px 14px rgba(26, 127, 75, 0.22);
    ::v-deep svg {
      width: 22px;
      height: 22px;
    }
    &.tone-excel {
      background: linear-gradient(145deg, #217346, #2d9c5a);
    }
    &.tone-raster {
      background: linear-gradient(145deg, #1565c0, #42a5f5);
    }
    &.tone-vector {
      background: linear-gradient(145deg, #6a1b9a, #ab47bc);
    }
  }

  .column-title-wrap { flex: 1; min-width: 0; }
  .column-title {
    font-size: 13px;
    font-weight: 600;
    color: #1a2e24;
    line-height: 1.3;
  }
  .column-sub {
    font-size: 12px;
    color: #7a8f86;
    margin-top: 2px;
  }
  .column-mini-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
  }

  .item-list {
    max-height: 320px;
    overflow-y: auto;
    padding: 8px;
  }

  .data-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 10px;
    margin-bottom: 6px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    border: 1px solid transparent;
    &:hover {
      background: #fff;
      border-color: #d8eadf;
    }
    &.checked {
      background: #e8f5ee;
      border-color: #b8dcc8;
    }
    ::v-deep .el-checkbox {
      margin-right: 0;
    }
  }

  .item-type-ico {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    border-radius: 6px;
    background: #eef6f2;
    position: relative;
    &.ft-xlsx::after {
      content: 'X';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 800;
      color: #217346;
    }
    &.ft-img::after {
      content: '';
      position: absolute;
      inset: 4px;
      border-radius: 4px;
      background: linear-gradient(135deg, #64b5f6, #1565c0);
    }
    &.ft-shp::after {
      content: '';
      position: absolute;
      left: 5px;
      right: 5px;
      top: 5px;
      bottom: 5px;
      border: 2px solid #8e24aa;
      border-radius: 2px;
      transform: rotate(8deg);
    }
  }

  .item-name {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    color: #334843;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item-carbon {
    font-size: 12px;
    font-weight: 600;
    color: #1a7f4b;
    flex-shrink: 0;
  }

  .summary-row {
    margin-bottom: 12px;
  }

  .summary-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border-radius: 12px;
    border: 1px solid #e8f0eb;
    background: #fff;
    transition: box-shadow 0.2s, border-color 0.2s;
    &.active {
      border-color: #1a7f4b;
      box-shadow: 0 8px 22px rgba(26, 127, 75, 0.12);
      border-left: 4px solid #1a7f4b;
    }
  }
  .summary-icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    ::v-deep svg {
      width: 24px;
      height: 24px;
    }
    &.tone-excel { background: linear-gradient(145deg, #217346, #2d9c5a); }
    &.tone-raster { background: linear-gradient(145deg, #1565c0, #42a5f5); }
    &.tone-vector { background: linear-gradient(145deg, #6a1b9a, #ab47bc); }
  }
  .summary-carbon {
    font-size: 22px;
    font-weight: 700;
    color: #1a7f4b;
    line-height: 1.1;
    small {
      font-size: 12px;
      font-weight: 500;
      color: #7a8f86;
    }
  }
  .summary-meta {
    margin-top: 6px;
    font-size: 12px;
    color: #7a8f86;
  }

  .live-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    margin-bottom: 14px;
    border-radius: 10px;
    background: linear-gradient(90deg, #e8f5ee, #f4fbf7);
    border: 1px solid #cfe8d9;
    font-size: 13px;
    color: #3d5248;
    b { color: #0f5c36; }
  }
  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #1a7f4b;
    box-shadow: 0 0 0 3px rgba(26, 127, 75, 0.25);
    animation: pulse 1.6s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.75; transform: scale(0.92); }
  }

  .filter-card {
    margin-bottom: 16px;
    ::v-deep .el-button--success {
      background: #1a7f4b;
      border-color: #1a7f4b;
    }
  }
  .filter-form {
    margin-bottom: -8px;
  }

  .charts-grid {
    margin-bottom: 8px;
  }
  .chart-card {
    border-radius: 12px;
    border: 1px solid #e8f0eb;
    margin-bottom: 16px;
  }
  .chart-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .chart-title {
    font-weight: 600;
    color: #1a2e24;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .chart-title-icon {
    color: #1a7f4b;
  }
  .chart-box {
    height: 340px;
    width: 100%;
  }
}
</style>
