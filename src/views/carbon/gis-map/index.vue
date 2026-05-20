<template>
  <div class="app-container carbon-page gis-page">
    <div class="page-header">
      <h2>GIS 地图</h2>
      <p class="page-desc">矢量图层叠加与区域详情查看</p>
    </div>
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card>
          <div slot="header">矢量图层 {{ visibleCount }}/{{ layers.length }}</div>
          <div v-for="layer in layers" :key="layer.id" class="layer-item">
            <el-checkbox v-model="layer.visible" @change="onLayerChange">{{ layer.name }}</el-checkbox>
            <div class="opacity-row">
              <span>透明度</span>
              <el-slider v-model="layer.opacity" :min="0" :max="100" size="small" />
              <span>{{ layer.opacity }}%</span>
            </div>
          </div>
        </el-card>
        <el-card v-if="selectedRegion" class="region-card">
          <div slot="header">区域详情</div>
          <p><b>{{ selectedRegion.name }}</b></p>
          <p>面积：{{ selectedRegion.area }}</p>
          <p>碳汇：{{ selectedRegion.carbon }}</p>
          <p>林种：{{ selectedRegion.forestType }}</p>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="map-card">
          <div class="map-placeholder" @click="pickRegion">
            <p>地图区域（点击标记查看详情）</p>
            <el-button v-for="r in regions" :key="r.id" size="mini" type="primary" plain class="map-marker" @click.stop="selectRegion(r)">{{ r.name }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getGisLayers, getGisRegions } from '@/api/carbon/gis'

export default {
  name: 'GisMap',
  data() {
    return {
      layers: [],
      regions: [],
      selectedRegion: null
    }
  },
  computed: {
    visibleCount() {
      return this.layers.filter(l => l.visible).length
    }
  },
  created() {
    getGisLayers().then(res => { this.layers = res.data })
    getGisRegions().then(res => { this.regions = res.data })
  },
  methods: {
    onLayerChange() {},
    selectRegion(r) {
      this.selectedRegion = r
    },
    pickRegion() {
      if (this.regions.length) this.selectedRegion = this.regions[0]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';
.layer-item { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #eee; }
.opacity-row { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-top: 8px; }
.opacity-row .el-slider { flex: 1; }
.region-card { margin-top: 16px; }
.map-placeholder {
  height: 520px;
  background: linear-gradient(180deg, #e8f5ee 0%, #c5e6d4 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #1a7f4b;
  position: relative;
}
.map-marker { margin: 6px; }
</style>


