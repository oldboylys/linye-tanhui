<template>
  <div class="app-container carbon-page">
    <div class="page-header">
      <h2>翻译表配置</h2>
      <p class="page-desc">管理数据字段的编码翻译映射规则</p>
    </div>
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6" v-for="item in statItems" :key="item.label">
        <div class="stat-card">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </el-col>
    </el-row>
    <el-card>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini">新增翻译表</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-radio-group v-model="statusFilter" size="small" @change="loadList">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="1">已启用</el-radio-button>
            <el-radio-button label="0">已停用</el-radio-button>
          </el-radio-group>
          <el-button size="mini" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="list">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="翻译表名称" min-width="140" />
        <el-table-column prop="code" label="编码" min-width="130">
          <template slot-scope="scope">
            <el-tag size="mini" type="info">{{ scope.row.code }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
        <el-table-column prop="mappingCount" label="映射数" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'info'" size="mini">
              {{ scope.row.status === '1' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160" />
        <el-table-column label="操作" width="120" align="center">
          <template>
            <el-button type="text" size="mini">查看</el-button>
            <el-button type="text" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getTranslationStats, getTranslationList } from '@/api/carbon/translation'

export default {
  name: 'TranslationTable',
  data() {
    return {
      loading: false,
      stats: {},
      list: [],
      statusFilter: ''
    }
  },
  computed: {
    statItems() {
      return [
        { label: '翻译表总数', value: this.stats.total },
        { label: '已启用', value: this.stats.enabled },
        { label: '已停用', value: this.stats.disabled },
        { label: '映射规则总数', value: this.stats.mappingTotal }
      ]
    }
  },
  created() {
    this.loadStats()
    this.loadList()
  },
  methods: {
    loadStats() {
      getTranslationStats().then(res => {
        this.stats = res.data
      })
    },
    loadList() {
      this.loading = true
      getTranslationList({ status: this.statusFilter }).then(res => {
        this.list = res.rows
        this.loading = false
      })
    },
    resetQuery() {
      this.statusFilter = ''
      this.loadList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';
.mb8 { margin-bottom: 12px; }
</style>

