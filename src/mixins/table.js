import dayjs from "dayjs";
import Pagination from '@/components/Pagination2/index';  // 封装 element-ui 分页组件
export default {
  data(){
    const that = this
    return {
      tableStyle: {
        // 表格样式
        body: {
          borderBottom: "1px dashed #BCBCBC",
          textAlign: "center",
          height: "84px",
          color: "#666",
          fontSize: "18px",
        },
        header: {
          backgroundColor: "rgba(67, 129, 230, .2)",
          textAlign: "center",
          fontSize: "20px",
          height: "60px",
          'font-weight': 'normal',
          color: '#333',
        },
        rowStyle({ row }) {
          const selectedStyle = {
            "border-bottom": "1px dashed #4381E6",
            background: "rgba(67, 129, 230, .05)",
            "border-top": "1px dashed #4381E6",
          };
          const normalStyle = {
            "border-bottom": "1px dashed #BCBCBC",
            background: "#fff",
            "border-top": "1px dashed #BCBCBC",
          };
          if (that.selected.includes(row.id)) {
            return selectedStyle;
          } else {
            return normalStyle;
          }
        },
      },
      // 分页数据
      page: {
        total: 11,
        size: 10,
        number: 1
      },
    }
  },
  components: {Pagination: Pagination},
  methods: {
    // 格式化时间
    timeFormatter(row, col, cellvalue) {
      return dayjs(cellvalue).format("YYYY/MM/DD HH:mm:ss");
    },
  }
}