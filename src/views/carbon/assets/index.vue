<template>
  <div class="app-container carbon-page">
    <div class="page-header">
      <h2>碳资产管理</h2>
    </div>
    <el-form :inline="true" size="small" class="mb16">
      <el-form-item label="区域"><el-select v-model="query.region" placeholder="全部区域" clearable><el-option label="全部区域" value="" /><el-option v-for="r in regionOpts" :key="r" :label="r" :value="r" /></el-select></el-form-item>
      <el-form-item label="开发类型"><el-select v-model="query.devType" placeholder="全部" clearable><el-option label="全部" value="" /><el-option label="CCER" value="CCER" /><el-option label="VCS" value="VCS" /><el-option label="碳票" value="碳票" /></el-select></el-form-item>
      <el-form-item><el-button type="primary" @click="loadList">查询</el-button></el-form-item>
    </el-form>
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card>
          <div slot="header">资源列表</div>
          <el-table v-loading="loading" :data="list">
            <el-table-column prop="id" label="资源ID" width="100" />
            <el-table-column prop="region" label="区域" />
            <el-table-column prop="area" label="面积 (hm²)" align="right" />
            <el-table-column prop="carbon" label="碳汇量 (tCO₂)" align="right" />
            <el-table-column prop="devType" label="开发类型" width="90" />
            <el-table-column prop="status" label="状态" width="90">
              <template slot-scope="scope"><el-tag size="mini">{{ statusLabel(scope.row.status) }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="80"><template><el-button type="text" size="mini">详情</el-button></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header">优先开发推荐</div>
          <div v-for="item in recommend" :key="item.region" class="recommend-item">
            <div class="recommend-top"><b>{{ item.region }}</b><span>潜力 {{ item.score }}</span></div>
            <el-tag :type="levelType(item.level)" size="mini">{{ levelLabel(item.level) }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAssetsList, getAssetsRecommend } from '@/api/carbon/assets'

export default {
  name: 'CarbonAssets',
  data() {
    return {
      loading: false,
      list: [],
      recommend: [],
      query: { region: '', devType: '' }
    }
  },
  computed: {
    regionOpts() {
      return [...new Set(this.list.map(i => i.region))]
    }
  },
  created() {
    this.loadList()
    getAssetsRecommend().then(res => { this.recommend = res.data })
  },
  methods: {
    loadList() {
      this.loading = true
      getAssetsList(this.query).then(res => {
        this.list = res.rows
        this.loading = false
      })
    },
    statusLabel(s) {
      return { certified: '已核证', developing: '开发中', traded: '已交易', pending: '待开发' }[s] || s
    },
    levelLabel(l) {
      return { strong: '强烈推荐', recommend: '推荐', normal: '一般' }[l] || l
    },
    levelType(l) {
      return { strong: 'danger', recommend: 'warning', normal: 'info' }[l] || 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';
.mb16 { margin-bottom: 16px; }
.recommend-item { padding: 12px 0; border-bottom: 1px solid #eee; }
.recommend-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
</style>

