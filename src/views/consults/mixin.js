import defaultAvatar from "@/assets/images/avatar.png";
import ConsultListItem from "@/views/consults/comp/ConsultListItem";
import ReplayMes from "@/views/consults/comp/ReplayMes";
import ConsultMes from "@/views/consults/comp/ConsultMes";
export default {
  data(){
    return {
      defaultAvatar
    }
  },
  components: { ConsultListItem, ReplayMes, ConsultMes },
  computed: {
    member() {
      return this.store.state.member;
    },
    accessInfo() {
      return this.store.state.accessInfo;
    },
    record() {
      return this.store.state.record;
    },
    user() {
      var user = this.store.state.user;
      user.picture = process.env.VUE_APP_BASE_PICTURE_URL + user.picture;
      return user;
    },
  }
}