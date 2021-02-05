<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16">
        菜单名称：
        <el-input style="width: 260px" v-model="keyword" @keyup.enter.native="getMenus"></el-input>
        <el-button type="primary" @click="highlightMenu" style="margin-left: 32px;">查询</el-button>
        <el-button @click="resetAdvSearch" style="margin-left: 24px;">重置</el-button>
      </el-col>
      <el-col :span="8">
        <el-button type="warning" icon="el-icon-plus" @click="addMenu" v-permission="'add_menu'">
          新增菜单
        </el-button>
      </el-col>
    </el-row>
    <!-- :default-expand-all="true" -->
    <el-table
      :data="tableData"
      :tree-props="{ children: 'children' }"
      row-key="id"
      :expand-row-keys="expandKeys"
      style="width: 100%; margin-top: 50px"
      border
    >
      <el-table-column prop="title" label="菜单名称" width="250"></el-table-column>
      <el-table-column prop="icon" label="图标" width="60">
        <template slot-scope="scope">
          <svg-icon
            v-if="!!scope.row.icon"
            :icon-class="scope.row.icon"
            style="width: 24px;height: 24px;color: #bfbfbf;"
          ></svg-icon>
        </template>
      </el-table-column>
      <el-table-column prop="farther" label="父级菜单"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column prop="url" label="URL"></el-table-column>
      <el-table-column prop="create_time" label="创建时间"></el-table-column>
      <el-table-column prop="update_time" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-link
            type="danger"
            v-if="scope.row.status == 1"
            :underline="false"
            @click="prohibit(scope.row)"
            v-permission="'del_menu'"
          >
            禁
          </el-link>
          <el-link
            type="success"
            v-if="scope.row.status == 0"
            :underline="false"
            @click="firing(scope.row)"
            v-permission="'del_menu'"
          >
            启
          </el-link>
          <el-link
            type="primary"
            :underline="false"
            @click="edit(scope.row)"
            style="margin: 0 10px"
            v-permission="'edit_menu'"
          >
            编
          </el-link>
          <el-link
            type="warning"
            :underline="false"
            @click="clcikDelete(scope.row)"
            v-permission="'del_menu'"
          >
            删
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!--显示新增/修改路由-->
    <el-dialog :visible.sync="showDialog" @close="handleclose" width="606px">
      <el-form
        label-position="right"
        label-width="100px"
        ref="addMenuForm"
        :model="addForm"
        :rules="addRules"
      >
        <el-form-item label="菜单名称:" prop="title">
          <el-input
            placeholder="请输入菜单名称"
            class="form-input"
            style="width: 260px"
            v-model="addForm.title"
          ></el-input>
        </el-form-item>
        <!-- 上级菜单 -->
        <el-form-item label="上级菜单:" prop="sort">
          <!-- @focus="observerCascader" -->
          <el-cascader
            ref="cascader"
            :key="keyValue"
            class="cascader"
            :props="defaultParams"
            :options="options"
            :clearable="true"
            v-model="menuIds"
            @change="getMenuIds"
          ></el-cascader>
        </el-form-item>
        <!-- v-show="addForm.pid == '0'" -->
        <el-form-item label="图标" prop="icon">
          <el-input
            placeholder="请选择图标"
            :value="addForm.icon"
            style="width: 260px; margin-right: 6px;"
            @clear="addForm.icon = ''"
            clearable
          >
            <div class="" slot="prepend" style="width: 24px">
              <svg-icon :icon-class="addForm.icon" v-if="addForm.icon !== ''"></svg-icon>
            </div>
            <el-button
              slot="append"
              @click="popverVisible = true"
              size="mini"
              type="text"
              style="width: 80px;"
            >
              {{ addForm.icon && addForm.icon.trim() === "" ? "添加图标" : "更换图标" }}
            </el-button>
          </el-input>

          <icon-select :icon.sync="addForm.icon" :visiable.sync="popverVisible"></icon-select>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input
            style="width: 140px"
            v-model="addForm.sort"
            :min="0"
            :max="99"
            :maxlength="3"
            oninput="value=value.replace(/\D/, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="URL:" prop="url">
          <el-input
            type="text"
            placeholder="输入_或者字母,且不能以_开头或者结尾"
            style="width: 260px"
            v-model="addForm.url"
            :rules="{
              validator(rules, value, callback) {
                if (!/^[a-zA-Z][a-zA-Z_]+[a-zA-Z]$/.test(value)) {
                  callback(new Error('输入_或者字母,且不能以_开头或者结尾'));
                } else {
                  callback();
                }
              }
            }"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="title">{{ formMode === "ADD" ? "新增菜单" : "编辑菜单" }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="preserve">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenus, editMenus, detailMenus, addMenus, reviseMenus } from "@/api/sys/menu.js";
import IconSelect from "@/components/IconSelect/index";
import { iterTreeArray } from "@/utils/index";
import { highlight, removeHighlight } from "@/utils/highlight";

export default {
  components: { IconSelect },
  data() {
    const validateUrl = (rule, value, callback) => {
      var reg = /^(?!_)(?!.*?_$)([\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$/i;
      if (!reg.test(value)) {
        callback(new Error("url只能输入_或者字母,且不能以_开头或者结尾"));
      } else if (value.trim().length < 1) {
        callback(new Error("url不能为空"));
      } else {
        callback();
      }
    };
    return {
      formMode: "ADD", // 弹框的模式，新增（ADD）或编辑（EDIT）
      showDialog: false,
      keyword: "",
      id: "", //编辑菜单使用
      menuIds: [],
      addForm: {
        title: "",
        pid: "",
        sort: "0",
        url: "",
        icon: ""
      },
      popverVisible: false, // 选择图标弹框
      tableData: [],
      addRules: {
        title: [{ required: true, trigger: "blur", message: "菜单名称不能为空" }]
        // url: [{ required: true, trigger: "blur", validator: validateUrl }]
      },
      selectedOptions: [],
      defaultParams: {
        label: "title",
        value: "id",
        children: "children",
        checkStrictly: true
      },

      options: [],
      keyValue: 0,
      // mo: null, // MutationObserve 对象实例，用来监听级联列表
      expandKeys: [] // 要展开的节点的ID
    };
  },

  created() {
    this.getMenus();
    this.$nextTick(vm => {
      const mo = new MutationObserver(recordList => {
        const flag = Array.from(recordList).some(ele =>
          ele.target.isEqualNode(document.querySelector(".el-cascader__dropdown"))
        );
        if (flag) {
          this.appendButton();
        }
      });
      mo.observe(document.querySelector(".app-container"), {
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["style"]
      });
    });
  },

  watch: {
    showDialog: function(flag) {
      if (!flag) {
        this.initMenuForm();
        this.menuIds = [];
      } else {
        // this.$nextTick(() => {
        //   this.observerCascader();
        // });
      }
    },
    options(newVal) {
      this.keyValue++; //只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    },
    "addForm.sort": function(val) {
      if (/^0\d+$/.test(val)) {
        this.addForm.sort = this.addForm.sort.replace("0", "");
      }
    }
  },
  methods: {
    //获取菜单id
    getMenuIds(val) {
      if (val.length > 0) {
        this.addForm.pid = val[val.length - 1];
      } else {
        this.addForm.pid = 0;
      }
    },

    //获取菜单
    async getMenus() {
      const keyword = this.keyword;
      const { mes } = await getMenus(keyword);
      this.tableData = mes;
    },

    //禁止
    prohibit(row) {
      const { id } = row;

      this.$confirm("确定禁止该菜单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return editMenus(id, 0);
        })
        .then(res => {
          row.status = 0;
        });
    },

    //启用
    firing(row) {
      const { id } = row;

      this.$confirm("确定启动该菜单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return editMenus(id, 1);
        })
        .then(() => {
          row.status = 1;
        });
    },

    //删除
    clcikDelete(row) {
      const { id } = row;
      this.$confirm("删除后无法恢复，你还要继续吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return editMenus(id, -1);
        })
        .then(res => {
          this.getMenus();
        });
    },

    // 高亮菜单
    highlightMenu() {
      removeHighlight();
      let node = document.querySelector(".el-table");
      let pattern = new RegExp(this.keyword, "mg");
      let set = new Set();
      for (let i of document.querySelectorAll("tr>td:first-child")) {
        highlight(i, pattern);
      }
      for (let { node, parent } of iterTreeArray(this.tableData)) {
        if (pattern.test(node.title)) {
          if (!!parent) {
            set.add(parent.id + "");
          }
        }
      }
      this.expandKeys = [...set];
    },

    // 去掉高亮
    resetAdvSearch() {
      this.expandKeys = [];
      this.keyword = "";
      removeHighlight();
    },

    //编辑
    edit(row) {
      this.id = row.id;
      this.showDialog = true;
      this.formMode = "EDIT";
      this.getDetailManus(this.id);
      this.addForm.title = row.title;
      this.addForm.sort = row.sort;
      this.addForm.url = row.url;
      this.addForm.icon = row.icon ? row.icon : "";
      //this.addForm.pid = row.id;
    },

    //获取菜单信息
    getDetailManus(id) {
      detailMenus(id).then(res => {
        const { tree } = res.mes;
        if (res.mes.hasOwnProperty("detail")) {
          // console.log(res.mes.hasOwnProperty("detail"));
          let detail = res.mes.detail;
          let pid = detail.pid;
          tree.map(item => {
            if (item.id == pid) {
              detail.level = 1;
            } else {
              if (item.hasOwnProperty("children")) {
                item.children.map(itemchild => {
                  if (itemchild.id == pid) {
                    detail.level = 2;
                  } else {
                    if (itemchild.hasOwnProperty("children")) {
                      itemchild.children.map(child => {
                        if (child.id == pid) {
                          detail.level = 3;
                          detail.levelId = itemchild.id;
                        }
                      });
                    }
                  }
                });
              }
            }
          });
          if (detail.level == 1) {
            this.menuIds = [0];
          } else if (detail.level == 2) {
            this.menuIds = [0, detail.pid];
          } else {
            this.menuIds = [0, detail.levelId, detail.pid];
          }
          this.addForm.pid = detail.pid;
        }
        this.options = tree;
      });
    },

    //添加菜单
    addMenu() {
      const id = 0;
      this.showDialog = true;
      this.formMode = "ADD";
      this.getDetailManus(id);
    },

    //保存信息
    preserve() {
      //添加菜单保存
      if (this.formMode === "ADD") {
        this.$refs.addMenuForm.validate(async valid => {
          const params = {
            title: this.addForm.title,
            pid: this.addForm.pid || 0,
            url: this.addForm.url,
            icon: this.addForm.icon,
            sort: Number(this.addForm.sort) || 0
          };
          if (valid) {
            this.loading = true;
            const res = await addMenus(
              params.title,
              params.pid,
              params.url,
              params.sort,
              params.icon
            );
            //console.log(res);
            this.showDialog = false;
            this.initMenuForm();
            this.getMenus();
            // this.logout();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        //编辑菜单保存
        this.$refs.addMenuForm.validate(async valid => {
          const params = {
            id: this.id,
            title: this.addForm.title,
            pid: this.addForm.pid || 0,
            url: this.addForm.url,
            icon: this.addForm.icon,
            sort: Number(this.addForm.sort) || 0
          };
          if (valid) {
            this.loading = true;
            const res = await reviseMenus(
              params.id,
              params.title,
              params.pid,
              params.url,
              params.sort,
              params.icon
            );
            //  console.log(res);
            this.showDialog = false;
            this.initMenuForm();
            this.getMenus();
            // this.logout();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },

    // 登出操作
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload();
      });
    },

    // 初始化菜单表单
    initMenuForm() {
      this.addForm = {
        title: "",
        pid: "",
        sort: "",
        url: "",
        icon: ""
      };
    },

    handleclose() {
      this.$nextTick(() => {
        this.$refs["addMenuForm"].resetFields();
        this.showDialog = false;
      });
    },

    // 级联列表 获得焦点 事件处理回调，添加“确认”和“取消”按钮
    observerCascader() {
      const targetNode = document.querySelector(".el-cascader__dropdown");
      const config = {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["style"],
        subtree: false
      };
      const callback = recordList => {
        // console.log(recordList);
        if (recordList.length > 0) {
          const node = document.querySelector(".hx-poppver-button");
          const flag = !!node;
          if (!flag) {
            this.appendButton();
          }
        }
      };
      const mo = new MutationObserver(callback);
      mo.observe(targetNode, config);
    },

    // 添加按钮节点至级联列表指定位置
    appendButton() {
      if (!!document.querySelector(".hx-poppver-button")) {
        return;
      }
      const that = this;

      const confirmButton = document.createElement("button");
      confirmButton.innerText = "确认";
      confirmButton.classList.add("hx-poppver-button", "hx-poppver-button__confirm");
      const cancelButton = document.createElement("button");
      cancelButton.innerText = "取消";
      cancelButton.classList.add("hx-poppver-button", "hx-poppver-button_cancel");
      [confirmButton, cancelButton].forEach(dom =>
        dom.addEventListener(
          "click",
          e => {
            // console.log(that.$refs.cascader);
            that.$refs.cascader.dropDownVisible = false;
          },
          false
        )
      );
      document.querySelector(".el-cascader-menu__wrap").appendChild(confirmButton);
      document.querySelector(".el-cascader-menu__wrap").appendChild(cancelButton);
    }
  }
};
</script>
<style>
/* 高亮样式 */
[data-mark="highlight"] {
  background: yellow;
  padding: 5px 0;
}
</style>

<style>
.hx-poppver-button {
  position: absolute;
  bottom: 8px;
  font-size: 14px;
  width: 50px;
  height: 24px;
  border: none;
  color: white;
  border-radius: 4px;
  outline: none;
  background-color: #fff;
  cursor: pointer;
}
.hx-poppver-button__confirm {
  border: 1px solid #1890ff;
  background-color: #1890ff;
  left: 15%;
}
.hx-poppver-button_cancel {
  right: 15%;
  color: #606266;
  border: 1px solid #dcdfe6;
}
</style>
