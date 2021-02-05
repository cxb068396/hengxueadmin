<template>
  <div @click="toggleShowHiteMsg">
    <el-badge :value="hasHiteMessage" :hidden="hasHiteMessage ===0 ? true : false" class="badge-item">
      <i class="el-icon-message-solid" style="font-size: 24px"></i>
    </el-badge>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getUnreadMessage } from "@/api/information/informations";
export default {
  name: "Notice",
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      hasHiteMessage: state => state.user.hiteMessage.length
    }),
    showHiteMessage: {
      get() {
        return this.$store.state.user.showHiteMessage;
      },
      set() {
        this.$store.commit("toggleShowHiteMessage");
      }
    }
  },
  created() {
    this.GetHiteMes();
    // const time = 1000 * 60 * 2
    const time = 1000 * 60;
    setInterval(() => {
      this.GetHiteMes();
    }, 60000);
  },
  methods: {
    ...mapActions(["GetHiteMes"]),
    toggleShowHiteMsg() {
      this.showHiteMessage = !this.showHiteMessage;
    }
  }
};
</script>

<style>
.el-badge__content.is-fixed {
  top: 10px !important;
}
</style>
