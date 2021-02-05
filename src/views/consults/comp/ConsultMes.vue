<template>
  <div class="consultant">
    <img :src="avatar?avatar:defaultAvatar" alt="" class="avatar" />
    <div class="text-bubble">{{content}}</div>
  </div>
</template>
<script>
import defaultAvatar from "@/assets/images/avatar.png";

export default {
  props: {
    avatar: String,
    content: String,
  },
  data() {
    return {
      defaultAvatar
    };
  },
  methods: {}
};
</script>
<style scoped lang="scss">
@import "~@/assets/styles/table-page.scss";
.text-bubble {
  width: auto;
  max-width: 668px;
  // height: 60px;
  background: #f4f4f4;
  border-radius: 16px;

  padding: 20px 40px;

  font-size: 20px;
  color: #666;
}
.consultant{
  display: flex;
  margin: 20px 0;
  align-items: center;
}
.consultant {
  align-self: flex-start;
  .avatar {
    margin-right: 20px;
  }
}

.avatar {
  width: 80px;
  height: 80px;

  border-radius: 50%;
}
</style>
