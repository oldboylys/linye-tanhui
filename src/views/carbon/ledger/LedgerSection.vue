<template>
  <el-card class="section-card">
    <div slot="header" class="section-header">
      <span>{{ block.label }} {{ block.count }} 条</span>
      <span class="section-meta">累计碳汇: {{ block.totalCarbon }} tCO₂ · 已完成 {{ block.completed }} / {{ block.count }}</span>
    </div>
    <el-table :data="block.rows" size="small">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="fileName" label="上传记录" min-width="260" show-overflow-tooltip />
      <el-table-column label="核算碳汇值 (tCO₂)" width="150" align="right">
        <template slot-scope="scope">{{ scope.row.carbonValue != null ? scope.row.carbonValue : '--' }}</template>
      </el-table-column>
      <el-table-column label="核算状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="statusType(scope.row.status)" size="mini">{{ statusText(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" align="center" fixed="right">
        <template slot-scope="scope">
          <span :class="['action-inline', scope.row.action === 'stored' ? 'is-stored' : '']">{{ actionText(scope.row.action) }}</span>
          <el-button
            type="text"
            size="small"
            icon="el-icon-download"
            class="btn-export"
            title="导出"
            @click="$emit('export-row', scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'LedgerSection',
  props: {
    block: { type: Object, required: true }
  },
  methods: {
    statusType(s) {
      return { done: 'success', pending: 'info', running: 'warning', failed: 'danger' }[s] || 'info'
    },
    statusText(s) {
      return { done: '核算完成', pending: '待核算', running: '核算中', failed: '核算失败' }[s] || s
    },
    actionText(a) {
      return { stored: '已入库', start: '开始核算', wait: '请稍候...', error: '数据异常' }[a] || a
    }
  }
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.section-meta {
  font-size: 12px;
  color: #6b7c74;
  font-weight: normal;
}
.action-inline {
  font-size: 13px;
  color: #3d5248;
  margin-right: 4px;
  vertical-align: middle;
}
.action-inline.is-stored {
  color: #1a7f4b;
}
.btn-export {
  color: #1a7f4b;
  padding: 0 4px;
  vertical-align: middle;
}
</style>
