<template>
  <div class="app-container contract-detail-container" >
    <!-- 合同基本信息 -->
    <div class="title-bar">
      <h1>合同基本信息</h1>
    </div>
    <div class="info-w flex-start">
      <div class="info-item">
        <div class="info-label">合同类别</div>
        <div class="info-content">新增</div>
      </div>
      <div class="info-item">
        <div class="info-label">合同编号</div>
        <div class="info-content">{{ contract.number }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">合同名称</div>
        <div class="info-content">{{ contract.name }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">合同状态</div>
        <div class="info-content">{{ contract.status | statusToText }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">客户姓名</div>
        <div class="info-content">{{ contract.username }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">客户联系方式</div>
        <div class="info-content">{{ contract.phone }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">合同开始时间</div>
        <div class="info-content">{{ contract.begin_time | dateFormater }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">合同结束时间</div>
        <div class="info-content">{{ contract.end_time | dateFormater }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">合同到期提醒</div>
        <div class="info-content">{{ contract.reminder | dateFormater }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">合同金额</div>
        <div class="info-content">{{ contract.money }}</div>
      </div>
    </div>
    <!-- 合同费用明细 -->
    <div class="title-bar" v-if="product.length > 0">
      <h1>合同费用明细</h1>
    </div>
    <div class="detail-w  flex-start" v-if="product.length > 0">
      <div class="detail-item" v-for="item in product" :key="item.id">
        <div class="info-item">
          <div class="info-label">项目名称</div>
          <div class="info-content">{{ item.name }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">项目费用</div>
          <div class="info-content">{{ item.product_cost }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">应付金额</div>
          <div class="info-content">{{ item.payable }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">开始时间</div>
          <div class="info-content">{{ item.begin_time | dateFormater }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">结束时间</div>
          <div class="info-content">{{ item.end_time | dateFormater }}</div>
        </div>
      </div>
    </div>

    <div class="contract-w flex-start">
      <div class="w1">
        <div class="title-bar" style="margin-left: 0;padding-left: 52px; margin-right: auto;">
          <h1>合同内容</h1>
        </div>
        <div class="list">
          <div class="list-item flex-start">
            <svg-icon icon-class="contract-file" class="icon" />
            <span class="name ellipsis">{{ hetong }}</span>
            <button class="btn-preview" @click="exContract">预览</button>
          </div>
        </div>
      </div>

      <div class="w2" v-if="fujian.length > 0">
        <div class="title-bar" style="margin-left: 0;padding-left: 52px; margin-right: auto;">
          <h1>合同附件</h1>
        </div>
        <div class="list">
          <div class="list-item flex-start" v-for="(item, index) in fujian" :key="index">
            <svg-icon icon-class="contract-file" class="icon" />
            <span class="name ellipsis">{{ item }}</span>
            <!-- <button class="btn-preview">预览</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 通用方法导入
import { getContract, downloadContracts } from "@/api/contract.js";
import { downloadFile } from "@/utils/index";
import dayjs from "dayjs";
export default {
  props: {
    id: Number
  },
  data() {
    return {
      contract: {
        number: "",
        name: "",
        status: "",
        username: "",
        phone: "",
        begin_time: "",
        end_time: "",
        reminder: "",
        money: ""
      },
      product: [],
      hetong: "",
      fujian: []
    };
  },
  computed: {},
  watch: {},
  filters: {
    statusToText(status) {
      // 状态对应文本
      const contractStatus = {
        "1": "起草中",
        "2": "待签约",
        "3": "已签约",
        "4": "已作废"
      };
      return contractStatus[status];
    },
    dateFormater(date) {
      return dayjs(date).format("YYYY-MM-DD");
    }
  },
  created() {
    // if (this.$route.query.hasOwnProperty("id")) {}
    if(this.id){
      this.getContractDetail(this.id)
    }
  },
  methods: {
    // 按钮 “预览” 事件处理
    exContract() {
      // 每次请求下载一个文件
      // 文件名和扩展名通过map对象取得

      downloadContracts(this.$route.query.id).then(res => {
        const name = this.hetong;
        const ext = "pdf";
        downloadFile(res, name, ext);
      });
    },
    // 获取合同详情
    getContractDetail(id) {
      getContract(id).then(res => {
        const { contract, product } = res;
        this.contract = contract;
        this.product = product;
        this.fujian = contract.fujian.filter(ele => ele != "");
        // this.fujian = [contract.hetong,contract.hetong];
        this.hetong = contract.hetong;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/table-page.scss";

.contract-detail-container{
  // min-width: 800px;
}

.title-bar {
  box-sizing: border-box;
  padding-top: 23px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
  padding-left: 22px;
  margin-right: 200px;
  margin-left: 50px;
  .h1 {
    width: 119px;
    height: 20px;
    font-size: 20px;
    color: #252525;
    line-height: 34px;
  }
}

.info-item {
  @include flex-start;
  // flex: 1;
  width: 340px;
  margin-bottom: 20px;
  .info-label {
    width: 110px;
    text-align: right;
    margin-right: 24px;
    color: #8e8e8e;
    &::after {
      content: ":";
    }
  }
  .info-content {
    font-weight: 300;
    color: #c5c5c5;
  }
}
.info-w {
  flex-wrap: wrap;
  width: 680px;
  margin-left: 70px;
  margin-top: 28px;
}
.detail-w {
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  margin-left: 70px;
  margin-top: 28px;
  .detail-item {
    height: 180px;
    margin-bottom: 20px;
  }
}

.contract-w {
  .w1,
  .w2 {
    width: 50vw;
    max-width: 500px;
    margin-left: 50px;
  }
  .list {
    padding: 36px 0 40px 67px;
    min-height: 200px;
    .list-item {
      width: 200px;
      height: 28px;
      width: 100%;
      box-sizing: border-box;
    }
    .icon {
      font-size: 18px;
      margin-right: 20px;
    }
    .name {
      // width: 134px;
      flex: 1;
      color: #666666;
    }
    .btn-preview {
      font-size: 16px;
      margin-left: 20px;
      color: #5193ff;
      width: 64px;
      height: 28px;
      border: 1px solid #5193ff;
      border-radius: 4px;
      background: none;
      cursor: pointer;
      &:focus {
        outline: none;
      }
    }
  }
}
</style>
