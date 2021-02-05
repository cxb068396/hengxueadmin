<template>
  <div class="progress-item" >
    <div class="flex-between" style="margin-bottom: 11px;">
      <span class="filename">{{filename}}</span>
      <i class="el-icon-circle-close icon-close" @click="onClick"></i>
    </div>
    <div class="progress-back">
      <div class="progress"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filename: String,
  },
  methods: {
    onClick(){
      this.$emit('rmUploadListItem')
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/table-page.scss";
.progress-item {
  margin-bottom: 11px;
  .progress-back {
    height: 7px;
    background: #f4f4f4;
    border-radius: 3px;
  }
  .progress {
    width: 336px;
    width: 416px;
    height: 7px;
    background: #83a7fd;
    border-radius: 3px;
  }
  .icon-close {
    width: 16px;
    height: 16px;
  }
}
</style>
