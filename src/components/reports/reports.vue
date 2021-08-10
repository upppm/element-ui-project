<template>
  <div>
    <breadcrumb>
      <span slot="one">数据统计</span>
      <span slot="two">数据报表</span></breadcrumb
    >
    <div id="main" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'
// 引入echarts
import * as echarts from 'echarts'
// 两对象合并
import _ from 'lodash'

export default {
  name: 'reports',
  components: {
    breadcrumb,
  },
  data() {
    return {
      resportsList: {},
    }
  },
  created() {
    this.getReportsOption()
  },
  methods: {
    async getReportsOption() {
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status == 200) {
        this.$message.success('获取报表成功')
      } else {
        this.$message.error('获取报表失败')
      }
      this.resportsList = res.data
      console.log(res)
      console.log(this.resportsList.legend.data)
    },
  },
  // 此时页面上的元素已经被渲染完毕了
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '用户来源',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: [],
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '华东',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '华南',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: '华北',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: '西部',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: '其他',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    }
    // 合并对象内容
    const newOption = _.merge(this.resportsList, option)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(newOption)
  },
}
</script>

<style lang="less" scoped>
</style>