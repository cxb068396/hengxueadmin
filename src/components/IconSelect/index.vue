<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    
    <el-popover
      placement="top"
      width="160"
      v-model="visiable"
      :width="260"
      popper-class="hx-popper"
    >
      <div class="icon-wrapper">
        <div class="icon-item" @click="selectIcon('hx-home')">
          <svg-icon icon-class="hx-home" class="popover-inner-icon"></svg-icon>
          <span class="name">home</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-gear')">
          <svg-icon icon-class="hx-gear" class="popover-inner-icon"></svg-icon>
          <span class="name">gear</span>
        </div>
        <div class="icon-item" @click="selectIcon('drop')">
          <svg-icon icon-class="drop" class="popover-inner-icon"></svg-icon>
          <span class="name">drop</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-book')">
          <svg-icon icon-class="hx-book" class="popover-inner-icon"></svg-icon>
          <span class="name">book</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-chart')">
          <svg-icon icon-class="hx-chart" class="popover-inner-icon"></svg-icon>
          <span class="name">chart</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-chat')">
          <svg-icon icon-class="hx-chat" class="popover-inner-icon"></svg-icon>
          <span class="name">chat</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-earphone')">
          <svg-icon icon-class="hx-earphone" class="popover-inner-icon"></svg-icon>
          <span class="name">earphone</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-edit')">
          <svg-icon icon-class="hx-edit" class="popover-inner-icon"></svg-icon>
          <span class="name">edit</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-financial')">
          <svg-icon icon-class="hx-financial" class="popover-inner-icon"></svg-icon>
          <span class="name">financial</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-human')">
          <svg-icon icon-class="hx-human" class="popover-inner-icon"></svg-icon>
          <span class="name">human</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-layer')">
          <svg-icon icon-class="hx-layer" class="popover-inner-icon"></svg-icon>
          <span class="name">layer</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-link')">
          <svg-icon icon-class="hx-link" class="popover-inner-icon"></svg-icon>
          <span class="name">link</span>
        </div>
        <div class="icon-item" @click="selectIcon('hx-woshou')">
          <svg-icon icon-class="hx-woshou" class="popover-inner-icon"></svg-icon>
          <span class="name">woshou</span>
        </div>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="button-bar">
        <el-button @click="$emit(`update:visiable`, false)" size="mini">
          取消
        </el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "IconSelect",
  props: {
    // popverVisible: Boolean,
    visiable: Boolean,
    icon: String
  },
  data() {
    return {
      // visiable: false,
    };
  },

  methods: {
    selectIcon(name) {
      this.$emit("update:icon", name);
      this.$emit("update:visiable", false);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-wrapper {
  height: 260px;
  overflow: scroll;
  // background: #efefef;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  &::-webkit-scrollbar {
    width: 8px;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 4px;
  }

  .icon-item {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;

    width: 65px;
    height: 65px;
    .popover-inner-icon {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
}
.button-bar {
  display: inline-block;
  width: 100%;
  text-align: right;
  padding-top: 8px;
}
</style>
