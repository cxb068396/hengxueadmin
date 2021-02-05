<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="true"
      :current-page.sync="page.number"
      :page-size.sync="page.size"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div class="pag-bottom" v-if="page.total>0">共{{page.total}}条记录  第{{page.number}}/{{Math.ceil(page.total/10)}}页</div>
    <div class="pag-bottom" v-else>共{{page.total}}条记录  第{{page.number}}/1页</div>
  </div>
</template>

<script>
import { scrollTo } from "@/utils/scroll-to";

export default {
  name: "Pagination",
  props: {
    page: {
      type: Object
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      layout: 'prev, pager, next, jumper',
      pageSizes: [6,8,10,20],
      // pageSizes: [10,20,50],
    };
  },

  methods: {
    handleSizeChange(val) {
      let page = this.page;
      page.size = val;
      page.number = 1;
      // this.$emit('update:page',page)
      this.$emit("pagination", page);
    },
    handleCurrentChange(val) {
      let page = this.page;
      page.number = val;
      // this.$emit('update:page',page)
      this.$emit("pagination", page);
    }
  }
};
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}

.pag-bottom{
  width: 100%;
  font-size: 8px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  text-align: center;
  display: block;
  margin-top: 5px;
}
</style>
