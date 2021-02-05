const form = {
  group_id: "", // 角色
  username: "", // 用户名
  phone: "", // 手机号
  mailbox: "", // 邮箱地址
  gender: 1, // 性别
  age: "", // 年龄

  region: "", // 地区

  department: "", // 部门
  employee_number: "", // 员工编号
  entry_time: "", // 入职时间
  quit_time: "", //离职时间

  education: "", //学历
  major: "", //专业
  hobby: "", //爱好
  specialty: "", //特长

  picture: "", // 头像
  password: "", // 密码
  checkPass: "" // 二次输入密码
};

// 表单验证规则
export const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" },
    {
      validator(rule, value, callback) {
        const zhReg = /^[\u4e00-\u9fa5]*$/;
        const enReg = /^[a-zA-Z]*$/;
        const val = value.trim();
        if (!zhReg.test(val) && !enReg.test(val)) {
          callback(new Error("请输入中文或英文字符，且不能混合输入"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  mailbox: [
    {
      required: true,
      trigger: "blur",
      message: "请输入符合格式的邮箱",
      pattern: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
    }
  ],
  phone: [
    {
      required: true,
      trigger: "blur",
      message: "请输入正确的手机号",
      pattern: /^0?(13|14|15|17|18)[0-9]{9}$/
    }
  ],
  group_id: [{ required: true, trigger: "blur", message: "请选择一个角色" }],
  gender: [{ required: true, trigger: "blur" }],
  age: [{ required: true, trigger: "blur" ,message: '年龄是必填项'}],

  department: [{ required: true, trigger: "blur",message: '部门是必填项',pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/ }],
  // employee_number: [{ required: true, trigger: "blur" ,message: '员工编号是必填项'}],
  entry_time: [{ required: true, trigger: "blur" ,message: '入职时间是必填项'}],

};
// 学历信息验证规则
export const eduRules = {
  education: {
    required: true,
    message: "请输入中英文字符",
    pattern: /^[\u4e00-\u9fa5a-zA-z]+$/
  },
  major: {
    required: true,
    message: "请输入中英文字符",
    pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/
  },
  // hobby: {  message: "请输入爱好" },
  // specialty: {  message: "请输入特长" }
};
// 密码验证规则
export const passwordRules = {
  trigger: "blur",
  validator(rules, value, callback) {
    const reg = /^[\w!@#$%^&*()-+]{6,12}$/;
    if (value.trim() === "") {
      callback(new Error("请输入密码"));
    }
    // else if (value.length < 2 && value.length > 12) {
    //   callback(new Error("请输入6到12位字符"));
    // }
    else if (!reg.test(value)) {
      callback(new Error("请输入6到12位字母、数字和特殊符号组合"));
    } else {
      callback();
    }
  }
};
// 查看密码验证规则
export const checkPassRules = {
  trigger: "blur",
  validator(rules, value, callback) {
    if (value.trim() === "") {
      callback(new Error("请再次输入密码"));
    } else if (value !== that.form.password) {
      callback(new Error("两次输入密码不一致!"));
    } else {
      callback();
    }
  }
};

// 初始化和重置form表单
export function initForm() {
  return { ...form };
}
