import router from "@/router/routers";

export default Vue => {
  Vue.directive("permission", {
    inserted: function(el, binding) {
      const { value } = binding;

      if (value && value.trim !== "") {
        const paths = router.currentRoute.meta.permission ? router.currentRoute.meta.permission : [];
        // console.log(router.currentRoute.meta);
        const hasPermission = paths.includes(value);
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        console.error(`need roles! Like v-permission="'add_product'"`);
        return false;
      }
    }
  });
};
