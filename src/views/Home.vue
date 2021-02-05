<template>
  <div class="dashboard-container">
    <div class="card-container">
      <div class="card">
        <span class="title">注册人数</span>
        <span class="count">{{ count.register }}</span>
        <!-- <span class="tend increase">21.85%</span> -->
      </div>
      <div class="card">
        <span class="title">咨询人数</span>
        <span class="count">{{ count.consult }}</span>
        <!-- <span class="tend increase">16.88%</span> -->
      </div>
      <div class="card">
        <span class="title">签约人数</span>
        <span class="count">{{ count.contract }}</span>
        <!-- <span class="tend decrease">13.75%</span> -->
      </div>
      <div class="card">
        <span class="title">月活跃人数</span>
        <span class="count">{{ count.active }}</span>
        <!-- <span class="tend increase">17.52%</span> -->
      </div>
    </div>
    <div class="chart-container">
      <div class="header-bar">
        <div class="tab-wrapper">
          <span :class="`tab ${key === 'sign' ? 'active' : ''}`" @click="toggleCharts('sign')">
            签约量
          </span>
          <span
            :class="`tab ${key === 'consult' ? 'active' : ''}`"
            @click="toggleCharts('consult')"
          >
            访问量
          </span>
        </div>

        <div class="date-wrapper">
          <span :class="`date ${date === 0 ? 'active' : ''}`" @click="toggleDate(0)">今日</span>
          <span :class="`date ${date === 1 ? 'active' : ''}`" @click="toggleDate(1)">本周</span>
          <span :class="`date ${date === 2 ? 'active' : ''}`" @click="toggleDate(2)">本月</span>
          <span :class="`date ${date === 3 ? 'active' : ''}`" @click="toggleDate(3)">本年</span>
        </div>
      </div>
      <div class="title">
        {{ key === "sign" ? "签约量趋势" : "咨询量趋势" }}
      </div>
      <div class="bar-chart chart" ref="sign"></div>
      <!-- <div class="bar-chart chart" ref="consult"></div> -->
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getHomeData } from "@/api/home";

// 柱状图配置
function getBarOptions(xAxis, yAxis, source) {
  return {
    xAxis: {
      ...xAxis,
      type: "category",
      axisLabel: { color: "#999999", fontSize: 16, interval: 0 },
      axisLine: {
        lineStyle: {
          color: "#BCBCBC",
          type: "dashed"
        }
      },

      axisTick: {
        show: false,
        alignWithLabel: false
      }
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false
      },
      axisLabel: {
        color: "#bcbcbc"
      },
      splitLine: { show: true, lineStyle: { color: "#bcbcbc", type: "dashed" } },
      axisTick: {
        show: false
      },
      name: "(人)",
      min: 0
    },
    dataset: [{ source }],
    series: [
      {
        type: "bar",
        coordinateSystem: "cartesian2d",
        barWidth: 18,
        itemStyle: {
          color: "#4381E6"
        },
        datasetIndex: 0
      }
    ]
  };
}

// 获取每月有多少天
function getMonthDay(year, month) {
  let days = null;
  if (year && month) {
    days = new Date(year, month + 1, 0).getDate();
  } else {
    const date = new Date();
    days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }
  return days;
}

export default {
  name: "Dashboard",
  components: {
    // PanelGroup,
    // LineChart,
    // RadarChart,
    // PieChart,
    // BarChart
  },
  data() {
    return {
      key: "sign", // 显示关键字
      date: 1, // 选中的日期 0 今日；1 本周；2 本月；3 本年；
      chart: null,
      count: {
        register: 0,
        consult: 0,
        contract: 0,
        active: 0
      }
    };
  },
  mounted() {
    this.initSignCharts();
    this.getHomeData();
  },
  methods: {
    getHomeData() {
      getHomeData().then(res => {
        console.log(res);
        this.count = res.mes;
      });
    },

    // 初始化签约柱状图
    initSignCharts() {
      var chart = echarts.init(this.$refs.sign);
      let xAxis = this.returnXAxis(this.date);
      let source = xAxis.data.map(ele => {
        return { month: ele, value: parseInt(Math.random() * 1000) };
      });
      let yAxis = {};
      let options = getBarOptions(xAxis, yAxis, source);
      chart.setOption(options);
      this.chart = chart;
    },

    updateCharts() {
      let xAxis = this.returnXAxis(this.date);
      let source = xAxis.data.map(ele => {
        return { month: ele, value: parseInt(Math.random() * 1000) };
      });
      let yAxis = {};
      let options = getBarOptions(xAxis, yAxis, source);
      this.chart.setOption(options);
    },

    // 初始化咨询量柱状图
    initConsultCharts() {
      var chart = echarts.init(this.$refs.consult);
      let options = getBarOptions();
      chart.setOption(options);
    },

    // 切换图表显示
    toggleCharts(key) {
      this.key = key;
      // if (key === "sign") {
      // } else if (key === "consult") {
      // }
      this.updateCharts();
    },

    // 根据选择日期的不同，返回不同的x轴配置
    // 0 今日；1 本周；2 本月；3 本年；
    returnXAxis(date) {
      let data = [];
      let name = null;

      if (date === 1) {
        data = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        name = "";
      } else if (date === 2) {
        for (let i = 0; i < getMonthDay(); i++) {
          data.push(i + 1 + "");
        }
        name = "(号)";
      } else if (date === 3) {
        data = [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月"
        ];
        name = "";
      }
      return { data, name };
    },

    // 签约量趋势
    returnYAxis() {
      let interval = 250;
    },

    // 切换日期
    toggleDate(date) {
      this.date = date;
      this.updateCharts();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@mixin flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-container {
  background: #e9e9e9;
  width: 100%;
  height: calc(100vh - 86px);
  box-sizing: border-box;
  // overflow: hidden;
  padding: 24px;
}
.card-container {
  --height: 200px;
  height: var(--height);
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-bottom: 24px;
  .card {
    // width: 380px;
    height: var(--height);
    flex: 1;
    margin-right: 24px;
    background: #ffffff;
    border-radius: 16px;
    @include flex-center;
    flex-direction: column;
    &:last-child {
      margin-right: 0;
    }
    .title {
      font-size: 18px;
      color: #999;
    }
    .count {
      font-size: 60px;
      color: #333;
      margin: 16px 0;
    }
    .tend {
      font-size: 24px;
      color: #f65952;
    }
    .increase {
      color: #f65952;
    }
    .decrease {
      color: #4bc451;
    }
  }
}

.chart-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 36px;
  color: #666;
  font-size: 24px;
  height: calc(100% - 250px);
  .header-bar {
    @include flex-between;

    .tab {
      display: inline-block;
      padding-bottom: 10px;
      cursor: pointer;
      &.active {
        color: #4381e6;
        border-bottom: 2px solid #568be8;
      }
      &:first-child {
        margin-right: 40px;
      }
    }
    .date {
      margin-right: 40px;
      cursor: pointer;
      &.active {
        color: #4381e6;
      }
    }
  }
  .title {
    font-size: 18px;
    color: #333333;
    margin: 6px 0;
    margin-left: 120px;
  }
  .chart {
    width: 100%;
    height: calc(100% - 40px);
  }
}

@media screen and (max-width: 1439px) {
  .card-container {
    --height: 180px;
    .card {
      margin-right: 64px;
    }
  }
  .chart-container{
    padding: 16px 24px;
    font-size: 18px;
    height: calc(100% - 220px)
  }
  .chart {
    // height: calc(100% - 40px);
  }
}
</style>
