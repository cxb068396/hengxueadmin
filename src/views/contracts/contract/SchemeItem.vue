<template>
  <div class="flex-start scheme-wrap">
    <img src="" alt="" class="scheme-img" />
    <div class="scheme-info">
      <div class="scheme-name">{{ scheme.name }}</div>
      <div class="flex-between">
        <span class="scheme-fee">费用：{{ scheme.product_cost }}元</span>
        <span class="scheme-date">
          项目起止日期：{{ scheme.begin_time | dateFormatter }}--{{
            scheme.end_time | dateFormatter
          }}
        </span>
      </div>
    </div>
    <svg-icon icon-class="contract-del2" class="icon-del2" @click="removeSchemeItem"></svg-icon>
    <svg-icon icon-class="contract-edit" class="icon-del2" @click="editSchemeItem"></svg-icon>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  props: {
    scheme: Object
  },
  filters: {
    dateFormatter(date) {
      return dayjs(date).format("YYYY-MM-DD");
    }
    
  },
  methods: {
    removeSchemeItem() {
      this.$emit("rmScheme");
    },
    editSchemeItem(){
      this.$emit('edScheme')
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/table-page.scss";

.scheme-img {
  width: 185px;
  height: 100px;
}
.scheme-wrap {
  margin-left: 36px;
  margin-bottom: 20px;
}
.scheme-info {
  width: 522px;
  height: 100px;
  font-size: 18px;
  margin-left: 26px;
  margin-right: 40px;
  border-radius: 4px;
  background: rgba(194, 194, 194, 0.1);
  padding-left: 28px;
  padding-right: 24px;
  .scheme-name {
    color: #434343;
    margin-top: 23px;
    margin-bottom: 18px;
  }
  .scheme-fee {
    color: rgba(255, 142, 8, 1);
  }
  .scheme-date {
    font-size: 16px;
    font-weight: 300;
  }
}
.icon-del2 {
  width: 28px;
  height: 28px;
  margin-right: 48px;
  cursor: pointer;
}
</style>
