<template>
  <div class="consult-item flex-between" @click="onClick">
    <img
      :src="consultInfo.image === '' ? defaultAvatar : consultInfo.image"
      class="avatar"
      alt=""
    />
    <div class="flex-1 flex-between column" style="height: 48px;">
      <div class="flex-start w-100p">
        <div class="font-20 c-333 ellipsis">{{ consultInfo.name }}</div>
        <div class="signing signing-no" v-if="consultInfo.signStatus === 1">未签约</div>
        <!-- <div class="signing signing-al" v-else>已签约</div> -->
        <div class="flex-1"></div>
        <div class="font-14 c-333 time">{{ consultInfo.update_at }}</div>
      </div>
      <div class="w-100p c-999 ellipsis">{{ consultInfo.last_message }}</div>
    </div>
  </div>
</template>
<script>
import defaultAvatar from "@/assets/images/avatar.png";

export default {
  props: {
    consultInfo: {
      type: Object,
      default: () => {
        return {
          
        };
      }
    },
    index: Number
  },
  data() {
    return {
      defaultAvatar
    };
  },
  methods: {
    onClick() {
      this.$emit("clicked", this.index);
    }
  }
};
</script>
<style scoped lang="scss">
@import "~@/assets/styles/table-page.scss";
.consult-item {
  padding: 24px 18px 24px 18px;
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .signing {
    width: 48px;
    height: 16px;
    line-height: 13px;
    font-size: 12px;
    text-align: center;
    border-radius: 2px;
    margin-left: 6px;
  }
  // 未签约
  .signing-no {
    border: 1px solid #f7931e;
    color: #f7931e;
  }
  // 已签约
  .signing-al {
    border: 1px solid #4bc451;
    color: #4bc451;
  }
}
</style>
