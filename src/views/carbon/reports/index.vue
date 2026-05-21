<template>
  <div class="app-container carbon-page carbon-reports-page">
    <div class="page-header">
      <h2>报告中心</h2>
    </div>

    <div class="reports-layout">
      <!-- 左侧：生成报告 + PDF 预览 -->
      <div class="right-pane">

          <div class="pdf-wrap">
            <div v-if="current && current.pdfUrl" class="pdf-frame-wrap">
              <!-- 使用浏览器内置 PDF 渲染（对接后端后 pdfUrl 指向实际文件即可） -->
              <iframe
                :key="pdfKey"
                class="pdf-frame"
                :src="current.pdfUrl"
                title="PDF预览"
              />
            </div>
            <el-empty v-else description="点击左侧报告加载 PDF 预览" />
          </div>
      </div>

      <!-- 右侧：接入数据 + 已生成报告 -->
      <div class="left-pane">
        <el-card class="left-panel-card" shadow="never">
          <div slot="header" class="left-card-topbar">
            <el-select v-model="reportType" placeholder="选择报告类型" size="small" class="type-select">
              <el-option v-for="t in reportTypes" :key="t" :label="t" :value="t" />
            </el-select>
            <el-button type="success" size="small" icon="el-icon-s-promotion" @click="generate">生成报告</el-button>
          </div>

          <div class="left-card-body">
            <section class="left-section">
              <div class="section-header">
                <span>接入数据</span>
                <div class="header-actions">
                  <el-button type="text" size="mini" @click="selectAll">全选</el-button>
                  <el-button type="text" size="mini" @click="clearAll">清空</el-button>
                </div>
              </div>
              <div class="section-scroll">
                <el-tabs v-model="datasetTab" class="dataset-tabs" stretch>
                  <el-tab-pane label="Excel" name="excel">
                    <div class="dataset-list">
                      <el-checkbox v-for="item in datasets.excel" :key="item.id" v-model="item.selected">
                        {{ item.name }} <span class="dataset-size">{{ item.size }}</span>
                      </el-checkbox>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="栅格影像" name="raster">
                    <div class="dataset-list">
                      <el-checkbox v-for="item in datasets.raster" :key="item.id" v-model="item.selected">
                        {{ item.name }} <span class="dataset-size">{{ item.size }}</span>
                      </el-checkbox>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="矢量地图" name="vector">
                    <div class="dataset-list">
                      <el-checkbox v-for="item in datasets.vector" :key="item.id" v-model="item.selected">
                        {{ item.name }} <span class="dataset-size">{{ item.size }}</span>
                      </el-checkbox>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </section>

            <div class="section-divider" />

            <section class="left-section">
              <div class="section-header">
                <span>已生成报告</span>
              </div>
              <div class="section-scroll">
                <div class="report-list">
                  <div
                    v-for="report in reports"
                    :key="report.id"
                    class="report-item"
                    :class="{ active: current && current.id === report.id }"
                    @click="openReport(report)"
                  >
                    <div class="report-item-main">
                      <div class="report-title">{{ report.title }}</div>
                      <div class="report-meta">
                        <span>{{ report.date }}</span>
                        <span class="dot">·</span>
                        <span>{{ report.type }}</span>
                      </div>
                      <div class="report-meta">
                        <el-tag size="mini" type="success" effect="plain">{{ report.status === 'done' ? '已完成' : report.status }}</el-tag>
                        <span class="count">{{ report.dataCount }} 份数据</span>
                      </div>
                    </div>
                    <div class="report-item-actions" @click.stop>
                      <el-button
                        size="mini"
                        type="success"
                        plain
                        icon="el-icon-download"
                        :disabled="!report.pdfUrl"
                        @click="downloadPdf(report)"
                      >
                        下载PDF
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </el-card>
      </div>
    </div>
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
      datasetTab: 'excel',
      pdfKey: 0
    }
  },
  created() {
    getReportsDatasets().then(res => { this.datasets = res.data })
    getReportsList().then(res => {
      this.reports = res.data
      // 默认选中第一条并加载预览
      if (!this.current && this.reports.length) {
        this.openReport(this.reports[0])
      }
    })
    getReportTypes().then(res => { this.reportTypes = res.data })
  },
  methods: {
    selectAll() {
      Object.keys(this.datasets).forEach(k => this.datasets[k].forEach(i => { i.selected = true }))
    },
    clearAll() {
      Object.keys(this.datasets).forEach(k => this.datasets[k].forEach(i => { i.selected = false }))
    },
    generate() {
      if (!this.reportType) {
        this.$message.warning('请选择报告类型')
        return
      }
      this.$message.success('报告生成任务已提交（Mock）')
      // 真实后端：这里可调用生成接口，生成完成后刷新 reports 列表并定位到新报告
    },
    openReport(report) {
      this.current = report
      this.reloadPdf()
    },
    reloadPdf() {
      this.pdfKey += 1
    },
    downloadPdf(report) {
      // 简单实现：打开 pdfUrl（对接后端后可换成下载流）
      if (!report.pdfUrl) return
      window.open(report.pdfUrl, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';

.reports-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;
  align-items: stretch;
}

.left-pane,
.right-pane {
  min-width: 0;
}

.left-pane {
  height: calc(100vh - 160px);
  min-height: 560px;
}

.left-panel-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid #e8f0eb;

  ::v-deep .el-card__header {
    padding: 12px 16px;
    border-bottom: 1px solid #e8f0eb;
  }
  ::v-deep .el-card__body {
    flex: 1;
    min-height: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
}

.left-card-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  .type-select {
    flex: 1;
    min-width: 0;
  }
}

.left-card-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.left-section {
  flex: 1 1 50%;
  max-height: 50%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-divider {
  flex-shrink: 0;
  height: 1px;
  background: #e8f0eb;
}

.section-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px 8px;
  font-weight: 600;
  font-size: 14px;
  color: #1a2e24;
  .header-actions {
    display: flex;
    gap: 6px;
  }
}

.section-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 16px 12px;
}

.dataset-tabs ::v-deep .el-tabs__item.is-active {
  color: #1a7f4b;
}
.dataset-tabs ::v-deep .el-tabs__active-bar {
  background-color: #1a7f4b;
}
.dataset-list {
  padding-right: 4px;
  .el-checkbox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0;
  }
  .dataset-size {
    color: #98a6a0;
    font-size: 12px;
    margin-left: 10px;
  }
}

.report-list {
  padding-bottom: 4px;
}

.report-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e8f0eb;
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    border-color: #b8dcc8;
  }
  &.active {
    background: #e8f5ee;
    border-color: #1a7f4b;
  }
}
.report-title {
  font-weight: 600;
  color: #1a2e24;
  margin-bottom: 6px;
  font-size: 13px;
}
.report-meta {
  font-size: 12px;
  color: #6b7c74;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  .dot {
    opacity: 0.7;
  }
  .count {
    margin-left: 8px;
    color: #8a9a92;
  }
}
.report-item-actions {
  display: flex;
  align-items: flex-start;
}

.pdf-wrap {
  height: calc(100vh - 160px);
  min-height: 560px;
}
.pdf-frame-wrap {
  height: 100%;
}
.pdf-frame {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 10px;
  background: #fff;
}

@media (max-width: 1100px) {
  .reports-layout {
    grid-template-columns: 1fr;
  }
  .left-pane {
    height: auto;
    min-height: 0;
  }
  .left-panel-card {
    height: auto;
    min-height: 480px;
  }
  .left-section {
    max-height: none;
    min-height: 220px;
  }
  .pdf-wrap {
    height: 560px;
    min-height: 560px;
  }
}
</style>


