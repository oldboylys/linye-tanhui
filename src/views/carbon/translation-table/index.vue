<template>
  <div class="app-container carbon-page translation-page">
    <div class="page-title-row">
      <div>
        <h2 class="page-title-line">翻译表配置</h2>
        <p class="page-desc">管理数据字段的编码翻译映射规则</p>
      </div>
      <el-button type="success" icon="el-icon-plus" size="small" @click="openForm('add')">新增翻译表</el-button>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :xs="12" :sm="6" v-for="item in statItems" :key="item.label">
        <div class="stat-card">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </el-col>
    </el-row>

    <el-card class="table-card" shadow="never">
      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          class="search-input"
          clearable
          prefix-icon="el-icon-search"
          placeholder="搜索翻译表名称/编码..."
          size="small"
          @keyup.enter.native="loadList"
          @clear="loadList"
        />
        <div class="toolbar-right">
          <el-radio-group v-model="statusFilter" size="small" @change="loadList">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="1">已启用</el-radio-button>
            <el-radio-button label="0">已停用</el-radio-button>
          </el-radio-group>
          <el-button size="small" icon="el-icon-refresh-left" class="reset-btn" @click="resetQuery">重置</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="list" class="translation-table">
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column prop="name" label="翻译表名称" min-width="140" />
        <el-table-column prop="code" label="编码" min-width="130">
          <template slot-scope="scope">
            <el-tag size="mini" type="info" effect="plain">{{ scope.row.code }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
        <el-table-column prop="mappingCount" label="映射数" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <span :class="['status-pill', scope.row.status === '1' ? 'is-on' : 'is-off']">
              <span class="status-dot" />
              {{ scope.row.status === '1' ? '已启用' : '已停用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-view" @click="openView(scope.row)" />
            <el-button type="text" size="small" icon="el-icon-edit" @click="openForm('edit', scope.row)" />
            <el-button type="text" size="small" class="btn-del" icon="el-icon-delete" @click="onDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑 -->
    <el-dialog
      :title="formMode === 'add' ? '新增翻译表' : '编辑翻译表'"
      :visible.sync="formVisible"
      width="520px"
      append-to-body
      custom-class="translation-form-dialog"
      @closed="resetFormModel"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" size="small">
        <el-form-item label="翻译表名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：林地类型编码表" maxlength="64" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="例如：FOREST_TYPE" maxlength="48" />
          <p class="form-hint">建议使用大写英文及下划线，与字段编码约定一致。</p>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="翻译表用途说明..." maxlength="256" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button label="1">启用</el-radio-button>
            <el-radio-button label="0">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer-inner">
        <el-button size="small" @click="formVisible = false">取 消</el-button>
        <el-button type="success" size="small" @click="submitForm">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog title="查看翻译表" :visible.sync="viewVisible" width="480px" append-to-body>
      <div v-if="viewRow" class="view-detail">
        <div class="view-row"><span class="view-label">名称</span><span class="view-val">{{ viewRow.name }}</span></div>
        <div class="view-row"><span class="view-label">编码</span><span class="view-val"><el-tag size="mini" type="info">{{ viewRow.code }}</el-tag></span></div>
        <div class="view-row block"><span class="view-label">说明</span><span class="view-val">{{ viewRow.description || '—' }}</span></div>
        <div class="view-row"><span class="view-label">映射数</span><span class="view-val">{{ viewRow.mappingCount }}</span></div>
        <div class="view-row">
          <span class="view-label">状态</span>
          <span class="view-val">
            <span :class="['status-pill', viewRow.status === '1' ? 'is-on' : 'is-off']">
              <span class="status-dot" />
              {{ viewRow.status === '1' ? '已启用' : '已停用' }}
            </span>
          </span>
        </div>
        <div class="view-row"><span class="view-label">更新时间</span><span class="view-val">{{ viewRow.updateTime }}</span></div>
      </div>
      <span slot="footer"><el-button size="small" type="primary" plain @click="viewVisible = false">关 闭</el-button></span>
    </el-dialog>
  </div>
</template>

<script>
import { getTranslationStats, getTranslationList, saveTranslation, removeTranslation } from '@/api/carbon/translation'

export default {
  name: 'TranslationTable',
  data() {
    return {
      loading: false,
      stats: {},
      list: [],
      keyword: '',
      statusFilter: '',
      formVisible: false,
      formMode: 'add',
      form: {
        id: null,
        name: '',
        code: '',
        description: '',
        status: '1'
      },
      formRules: {
        name: [{ required: true, message: '请输入翻译表名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }]
      },
      viewVisible: false,
      viewRow: null
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
      getTranslationList({
        status: this.statusFilter,
        keyword: this.keyword
      }).then(res => {
        this.list = res.rows
        this.loading = false
      })
    },
    resetQuery() {
      this.keyword = ''
      this.statusFilter = ''
      this.loadList()
    },
    openView(row) {
      this.viewRow = { ...row }
      this.viewVisible = true
    },
    openForm(mode, row) {
      this.formMode = mode
      if (mode === 'edit' && row) {
        this.form = {
          id: row.id,
          name: row.name,
          code: row.code,
          description: row.description || '',
          status: row.status
        }
      } else {
        this.form = {
          id: null,
          name: '',
          code: '',
          description: '',
          status: '1'
        }
      }
      this.formVisible = true
      this.$nextTick(() => {
        if (this.$refs.formRef) this.$refs.formRef.clearValidate()
      })
    },
    resetFormModel() {
      if (this.$refs.formRef) this.$refs.formRef.resetFields()
    },
    submitForm() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        saveTranslation(this.form).then(() => {
          this.$message.success('保存成功')
          this.formVisible = false
          this.loadStats()
          this.loadList()
        })
      })
    },
    onDelete(row) {
      this.$confirm(`确定删除翻译表「${row.name}」吗？`, '删除确认', {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      })
        .then(() => removeTranslation(row.id))
        .then(() => {
          this.$message.success('已删除')
          this.loadStats()
          this.loadList()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';

.translation-page {
  .page-title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .page-title-line {
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 600;
    color: #1a2e24;
  }
}

.table-card {
  border-radius: 12px;
  border: 1px solid #e8f0eb;
}

.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input {
  width: 280px;
  max-width: 100%;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.toolbar-right ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: #1a7f4b;
  border-color: #1a7f4b;
  box-shadow: -1px 0 0 0 #1a7f4b;
}

.reset-btn {
  border-color: #cfe8d9;
}

.translation-table .btn-del {
  color: #f56c6c;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  &.is-on {
    color: #1a7f4b;
    .status-dot {
      background: #1a7f4b;
      box-shadow: 0 0 0 2px rgba(26, 127, 75, 0.2);
    }
  }
  &.is-off {
    color: #e6a23c;
    .status-dot {
      background: #e6a23c;
      box-shadow: 0 0 0 2px rgba(230, 162, 60, 0.2);
    }
  }
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.form-hint {
  margin: 4px 0 0;
  font-size: 12px;
  color: #98a89f;
  line-height: 1.4;
}

.view-detail {
  padding: 0 4px 8px;
}
.view-row {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f4f2;
  font-size: 13px;
  &.block .view-val {
    flex: 1;
    white-space: pre-wrap;
    color: #3d5248;
  }
}
.view-label {
  width: 88px;
  flex-shrink: 0;
  color: #7a8f86;
}
.view-val {
  color: #1a2e24;
}
</style>

<style lang="scss">
.translation-form-dialog .el-dialog__body {
  padding-top: 8px;
  padding-bottom: 8px;
}
.translation-form-dialog .el-dialog__footer {
  padding: 12px 20px 16px;
  border-top: 1px solid #f0f0f0;
}
.translation-form-dialog .dialog-footer-inner {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.translation-form-dialog .el-button--success {
  background: #1a7f4b;
  border-color: #1a7f4b;
}
</style>
