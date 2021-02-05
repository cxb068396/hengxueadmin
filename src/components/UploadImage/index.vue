<template>
      
  <div class="pictureupload">
     <el-upload
      :action="baseUrl + '/api/public/image'"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-exceed="handleExceed"
      :before-remove="beforeRemove"
       name="img"
      :on-success="upLoadSuccess"
      :data="upLoadData"
      :headers="headers"
      :limit="limit"
    >
      <i class="el-icon-plus"></i>         
    </el-upload>
      <el-dialog :visible.sync="dialogVisible">
     <img width="100%" :src="dialogImageUrl" alt="" />       
       </el-dialog
    >
        
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";

export default {
  props: {
    imgList: {
      type: Array,
      default: [],
    }, // 父组件传递的图片列表
    limit: "", // 图片数量限制
  },
  data() {
    return {
      fileList: [],
      upLoadData: {
        img: "",
      },
      baseUrl: process.env.BASE_API,
      dialogVisible: false,
      dialogImageUrl: "",
       headers: {
        'Authorization': getToken()
      }, // 接口调用token
    };
  },
  watch: {
    // 监听imgList的变化： fileList要求的格式为[{url: img}],所以监听imgList变化后将其进行处理，赋值给fileList
    imgList: {
      handler(newValue, oldValue) {
        if (newValue.length === 0) {
          this.fileList = [];
          return;
        }
        for (let i = 0; i < newValue.length; i++) {
          if (oldValue[i] != newValue[i]) {
            this.fileList = [];
            newValue.forEach((el) => {
              this.fileList.push({ url: el });
            });
            return;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    // 图片移除时处理数据
    handleRemove(file, fileList) {
      let item = [];
      fileList.forEach((el) => {
        item.push(el.url);
      });
      this.$emit("removeimg", item);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }, // 判断图片数量
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {}, // 上传图片成功事件
    upLoadSuccess(response) {
      this.$emit("uploadimg", response.message);
      this.$message("上传成功");
    },
  },
  mounted() {
    if (this.imgList.length != 0) {
      this.imgList.forEach((el) => {
        this.fileList.push({ url: el });
      });
    }
  },
};
</script>


// 引用

//  <pictureupload 
//         @uploadimg="uploadimg" 
//         :imgList="ruleForm.img" 
//         :limit="3" 
//         @removeimg="removeimg" />
// </template>

// import pictureupload from '@/components/index'

//  components: {
//         pictureupload
//     },
//     methods: {
//         removeimg(item) {
//             this.ruleForm.img = item;
//         },
//         uploadimg(item) {
//             this.ruleForm.img.push(item);
//         }
//     }

