<template>
  <div>
    <editor id="tinymceEditor" :init="tinymceInit" v-model="myValue"></editor>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/image";
import "tinymce/plugins/advlist";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/paste";
import "tinymce/plugins/preview";
import "tinymce/plugins/fullscreen";
import { addProducrt } from "@/api/information/informations";
import { mapGetters } from "vuex";
export default {
  components: {
    editor: Editor,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      defaul: "",
    },
  },
  data() {
    return {
      tinymceInit: {},
      myValue: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    },
  },
    computed: {
    ...mapGetters([
      'token'
    ])
  },
  methods: {},
  created() {
    const that = this;
    this.tinymceInit = {
      skin_url: `tinymce/skins/ui/oxide`,
      content_css: `tinymce/skins/content/default`,
      language_url: `tinymce/langs/zh_CN.js`,
      language: "zh_CN",
      browser_spellcheck: true, // 拼写检查
      branding: false, // 去水印
       elementpath: false,  //禁用编辑器底部的状态栏
      height: 300,
      statusbar: false, // 隐藏编辑器底部的状态栏
      paste_data_images: true, // 允许粘贴图像
       powerpaste_word_import: 'merge', 
      menubar: false, // 隐藏最上方menu
      plugins: "advlist table lists image paste preview fullscreen",

      toolbar:
        "fontselect fontsizeselect forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | imageUpload quicklink h2 h3 blockquote image table numlist bullist preview fullscreen",
      /**
       * 下面方法是为tinymce手动添加图片
       * 
       */
      images_upload_handler: (blobInfo, success, failure) => {
        var that = this;
        let formData = new FormData();
        formData.append("img", blobInfo.blob());
        this.$http({
          url: this.url,
          method: "post",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" ,'Authorization':this.token}
        }).then(res=>{
          if(res.data.code=='200'){
             var url = process.env.VUE_APP_BASE_PICTURE_URL + res.data.mes;
             success(url) //将上传的图片自动插入到光标所在处
          }
        })
      },
    };
  },

  mounted() {
    // this.init()
    console.log(this.url);
    console.log(this.token)
  },
};
</script>

<style lang="scss" scoped>
</style>



