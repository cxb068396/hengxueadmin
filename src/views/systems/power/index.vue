// 功能设置
<template>
  <div class="app-container flex-start item-start hx-container">
    <div class="left">
      <div class="header">选择角色</div>
      <div class="role-list flex-start column scroll-bar" v-scrollbar>
        <ul>
          <li v-for="role in roleList" :key="role.id">
            <el-radio v-model="chosenRole" :label="role.id">{{ role.title }}</el-radio>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="tree-container">
        <!--  :default-expand-all="isExpandAll" -->
        <el-tree
          :data="originMenus"
          class="tree scroll-bar"
          ref="tree"
          node-key="id"
          show-checkbox
          :props="treeOptions"
          :check-strictly="true"
          @check-change="checkChange"
          :default-expanded-keys="expandKeys"
          v-scrollbar
        ></el-tree>
        <el-button
          class="hx-confirm-purview"
          type="primary"
          @click="onConfirm"
          v-permission="'save_power'"
        >
          保存
        </el-button>
        <el-button class="hx-btn-reset" @click="onReset">清除选择</el-button>
        <!-- <el-button class="hx-btn-expand-all" @click="isExpandAll = !isExpandAll">
          {{ isExpandAll ? "收起所有" : "展开所有" }}
        </el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { savepurview, getPower } from "@/api/sys/role.js";
import { getMenus } from "@/api/sys/menu.js";

/**
 * 采用非递归方式遍历树形数组，返回一个可用于for-of循环遍历的迭代器对象，每轮for-of循环都可以拿到此次遍历的节点和父节点
 * @param {array} array 待遍历的数组
 * @param {boolean} options.containRoot 遍历第一层节点（array直接子节点）时是否返回array本身
 * @param {string} options.children 数组中包含子节点的属性名称，不指定的话使用 children
 */
function* iterTreeArray(array, options) {
  // 检查配置
  let containRoot = options && options.containRoot ? options.containRoot : false;
  let childrenLabel =
    options && options.children && typeof options.children === "string"
      ? options.children
      : "children";
  const stack = [
    {
      key: "root",
      value: array,
      children: array
    }
  ];
  while (stack.length > 0) {
    var top = stack.pop();
    var parent = top.value;
    var children = top.children;
    for (let n of children) {
      if (parent === array) {
        if (containRoot) {
          yield { node: n, parent: parent };
        } else {
          yield { node: n, parent: undefined };
        }
      } else {
        yield { node: n, parent: parent };
      }
      if (n[childrenLabel] && Array.isArray(n[childrenLabel]) && n[childrenLabel].length > 0) {
        stack.push({
          key: "",
          value: n,
          children: n[childrenLabel]
        });
      }
    }
  }
}

export default {
  name: "App",
  data() {
    return {
      chosenRole: "",
      roleList: [],
      originMenus: [],
      menuContext: null,
      treeOptions: {
        // 树形组件配置
        label: "title"
      },
      isExpandAll: false,
      expandKeys: [],
    };
  },
  watch: {
    // 切换角色时重设树形菜单的选择状态
    chosenRole: function(id, old) {
      this.roleList.forEach(({ id: rid, rules }) => {
        if (rid === id) {
          let checked = rules.includes(",")
            ? rules.split(",").map(num => Number.parseInt(num, 10))
            : rules === ""
            ? []
            : [Number.parseInt(rules, 10)];
          console.log(checked);
          this.$refs.tree.setCheckedKeys(checked);
        }
      });
    },
    isExpandAll: function(flag) {
      if (flag) {
        const keys = [];
        for(let {node} of iterTreeArray(this.originMenus)){
          keys.push(node.id)
        }
        this.expandKeys = keys
      } else {
        this.expandKeys = []
      }
    }
  },
  created() {
    this.getPower();
  },
  directives: {
    scrollbar: function(el) {
      el.style.cssText = `overflow: hidden;`;
      el.addEventListener(
        "mouseover",
        e => {
          e.currentTarget.style.cssText = `overflow: scroll;overflow: overlay;`;
        },
        false
      );
      el.addEventListener(
        "mouseout",
        e => {
          e.currentTarget.style.cssText = `overflow: hidden;`;
        },
        false
      );
    }
  },
  methods: {
    // 获取包含所有角色的列表
    async getPower() {
      const power = await getPower();
      this.originMenus = power.mes.power;
      this.roleList = power.mes.jue.map(ele => {
        if (ele.rules === null) {
          ele.rules = "";
        }
        return ele;
      });
      this.menuContext = this.generateMenusContextMap(power.mes.power);
    },

    // 生成 菜单上下文map对象
    generateMenusContextMap(treeArr) {
      let menuContext = new Map();
      for (let { node, parent } of iterTreeArray(treeArr)) {
        menuContext.set(node.id, { node, parent });
      }
      // console.log(menuContext);
      return menuContext;
    },

    // 提交树形菜单的选择状态
    async onConfirm() {
      // 获取树形视图中选中节点的key
      // this.$refs.tree.getCheckedKeys();
      if (!this.chosenRole) {
        this.$message({ type: "error", message: "请先选择一个角色" });
        return false;
      }
      var checkedKeys = this.$refs.tree.getCheckedKeys();
      var halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      const rules = [].concat(checkedKeys, halfCheckedKeys);
      if (rules.length === 0) {
        this.$message({ type: "error", message: "请至少选择一项权限" });
        return false;
      }
      // var halfCheckedKeys = []
      try {
        const res = await savepurview(this.chosenRole, rules);

        for (let i in this.roleList) {
          if (this.roleList[i].id === this.chosenRole) {
            this.$set(this.roleList[i], "rules", checkedKeys.join(","));
            break;
          }
        }
        this.$message({ type: "success", message: res.mes });
      } catch (err) {
        console.log(err);
      }
    },

    // 选中子节点选中父节点，选中父节点不选中子节点。
    checkChange({ id, children }, checked) {
      if (checked) {
        let parent = this.menuContext.get(id).parent;
        while (parent) {
          this.$refs.tree.setChecked(parent.id, true);
          parent = this.menuContext.get(parent.id).parent;
        }
      } else {
        if (!!children) {
          for (let { node } of iterTreeArray(children)) {
            this.$refs.tree.setChecked(node.id, false);
          }
        }
      }
    },

    // 清除树形组件的选择
    onReset() {
      this.$refs.tree.setCheckedKeys([]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";

// end

.left {
  margin-right: 20px;
  flex-basis: 280px;

  .header {
    height: 60px;
    line-height: 60px;
    background-color: rgba(67, 129, 230, 0.2);
    font-size: 20px;
    color: #4381e6;
    text-align: center;
    margin-bottom: 30px;
  }
  ul,
  li {
    padding: 0;
    margin: 0;
  }
  ul {
    margin-right: 40px;
  }
  li {
    list-style: none;
    // text-align: center;
    padding-left: 15%;
    height: 60px;
    line-height: 60px;
  }
  .role-list {
    height: 650px;
    overflow: scroll;
  }
}
.right {
  $treeW: 400px;
  max-width: 1000px;
  flex: 1;
  padding: 52px 162px 0 162px;

  border: 1px dashed #4381e6;
  .tree-container {
    width: $treeW;
    position: relative;
  }
  .hx-confirm-purview {
    width: 80px;
    position: absolute;
    top: 10px;
    right: -100px;
  }
  .hx-btn-reset {
    position: absolute;
    top: 70px;
    right: -100px;
  }
  .hx-btn-expand-all {
    position: absolute;
    top: 130px;
    right: -100px;
  }
  .tree {
    width: $treeW;
    height: 640px;
    overflow-y: scroll;
  }
}

.left,
.right {
  height: 746px;
  background-color: rgba(67, 129, 230, 0.05);
}

.hx-container {
  ::v-deep .el-radio__label {
    font-size: 20px;
  }
  ::v-deep .el-radio {
    margin-right: 40px;
  }
}
</style>
