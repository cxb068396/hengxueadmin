<template>
  <div class="login" :style="'background-image:url(' + Background + ');'">
    <div class="login-form">
      <div class="login-form-left" :style="'background-image:url(' + Bg + ');'">
        <img src="../assets/images/logo1.png" alt="" class="logo1" />
        <div class="welcome">
          欢迎来到
          <img src="../assets/images/navigation.png" alt="" class="navigation" />
        </div>
        <div class="title">衡学教育内部平台</div>
      </div>
      <div class="login-form-right">
        <div v-show="normalLogin" class="login-normal">
          <div class="login-title">用户登录</div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            style="margin-bottom: 29px;margin-top: 20px;"
          >
            <el-form-item prop="username">
              <div class="login-input">
                <div class="login-input-icon">
                  <img src="../assets/images/yonghu.png" alt="" />
                </div>
                <el-input
                  v-model="loginForm.username"
                  type="text"
                  placeholder="请输入账号(手机号或用户名)"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="login-input">
                <div class="login-input-icon">
                  <img src="../assets/images/mima.png" alt="" />
                </div>
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  autocomplete="new-password"
                  @keyup.enter.native="handleLogin"
                  placeholder="请输入密码"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item style="width: 100%; margin-top: 50px">
              <el-button
                :loading="loading"
                size="medium"
                class="btn"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
            <!-- <div class="forget-password">
              <span @click="goPassword">忘记密码</span>
            </div> -->
          </el-form>
        </div>
        <div v-show="!normalLogin" class="login-pass">
          <div class="login-title">忘记密码</div>
          <el-form ref="passForm" :model="passForm" :rules="passRules" style="margin-bottom: 29px">
            <el-form-item prop="phone">
              <div class="login-input">
                <div class="login-input-icon">
                  <img src="../assets/images/yonghu.png" alt="" />
                </div>
                <el-input
                  v-model="passForm.phone"
                  type="text"
                  placeholder="请输入手机号"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item prop="password1">
              <div class="login-input">
                <div class="login-input-icon">
                  <img src="../assets/images/mima.png" alt="" />
                </div>
                <el-input
                  v-model="passForm.password1"
                  type="password"
                  @keyup.enter.native="passwordLogin"
                  placeholder="设置新密码"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item prop="code">
              <div class="login-input">
                <div class="login-input-icon">
                  <img src="../assets/images/code.png" alt="" />
                </div>
                <div class="pass">
                  <el-input
                    v-model="passForm.code"
                    placeholder="请输入手机验证码"
                    size="mini"
                    @keyup.enter.native="passwordLogin"
                  ></el-input>
                </div>
                <div class="login-code" @click="handleSend" :class="[{ display: msgKey }]">
                  {{ msgText }}
                </div>
                
              </div>
            </el-form-item>

            <el-form-item style="width: 100%; margin-top: 44px">
              <el-button size="medium" class="btn" @click.native.prevent="passwordLogin">
                <span>确认</span>
              </el-button>
            </el-form-item>
            <div class="" style="font-size: 12px;color: white;text-align: center; font-weight: 300;cursor: pointer;" @click="() => normalLogin = true">返回登录</div>
          </el-form>
        </div>
      </div>
    </div>
    <!--  底部  -->
    <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span>⋅</span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">
        {{ $store.state.settings.caseNumber }}
      </a>
    </div>
  </div>
</template>



<script>
import { encrypt } from "@/utils/rsaEncrypt";
import Config from "@/settings";
import Cookies from "js-cookie";
import Background from "@/assets/images/background.png";
import Bg from "@/assets/images/background1.png";
const MSGINIT = "发送验证码";
const MSGSCUCCESS = "${time}秒后重发";
const MSGTIME = 60;
import { isvalidatemobile } from "@/utils/validate";
export default {
  name: "Login",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error("请输入4位数的验证码"));
      } else {
        callback();
      }
    };
    return {
      Background: Background,
      Bg: Bg,
      codeUrl: "",
      cookiePass: "",
      normalLogin: true,
      msgText: MSGINIT,
      msgTime: MSGTIME,
      msgKey: false,
      loginForm: {
        username: "",
        password: ""
      },
      passForm: {
        phone: "",
        password1: "",
        code: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
          { min: 2, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
          {
            validator(rules, val, callback) {
              const phone_reg = /^1\d{10}$/;
              if (/^\d*$/.test(val) && !phone_reg.test(val)) {
                callback(new Error("手机号输入不正确，请重新输入"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
          { message: "长度在 6 到 12 个字符", pattern: /^[\w!@#$%^&*()-+]{6,12}$/, trigger: "blur" }
        ]
      },
      passRules: {
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        password1: [{ required: true, trigger: "blur", message: "密码不能为空" }],
        code: [{ required: true, trigger: "change", validator: validateCode }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
        console.log("请打印", this.redirect);
      },
      immediate: true
    }
  },
  created() {
    // 获取用户名密码等Cookie
    this.getCookie();
    // token 过期提示
    this.point();
  },
  methods: {
    //获取手机验证码
    handleSend() {
      if (this.msgKey) return;
      this.msgText = MSGSCUCCESS.replace("${time}", this.msgTime);
      this.msgKey = true;
      const time = setInterval(() => {
        this.msgTime--;
        this.msgText = MSGSCUCCESS.replace("${time}", this.msgTime);
        if (this.msgTime === 0) {
          this.msgTime = MSGTIME;
          this.msgText = MSGINIT;
          this.msgKey = false;
          clearInterval(time);
        }
      }, 1000);
    },
    //是否切换忘记密码页面
    goPassword() {
      this.normalLogin = false;
    },

    getCookie() {
      const username = Cookies.get("username");
      let password = Cookies.get("password");
      this.cookiePass = password === undefined ? "" : password;
      password = password === undefined ? this.loginForm.password : password;
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password
      };
    },
    //用户登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password
        };
        // if (user.password !== this.cookiePass) {
        //   user.password = encrypt(user.password);
        // }
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", user)
            .then(() => {
              this.loading = false;
              this.$message({ type: "success", message: "登录成功，即将跳转页面" });
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(error => {
              console.log(error);
              if (error.code == "400" && error.mes) {
                this.$message({ type: "error", message: error.mes });
              }else{
                this.$message({ type: "error", message: '登录出现异常，请稍后重试' });
              }
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改验证码
    passwordLogin() {
      this.$refs.passForm.validate(valid => {
        const user = {
          phone: this.passForm.phone,
          password1: this.passForm.password1,
          code: this.passForm.code
        };
        if (valid) {
          //TODO
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    point() {
      const point = Cookies.get("point") !== undefined;
      if (point) {
        this.$notify({
          title: "提示",
          message: "当前登录状态已过期，请重新登录!",
          type: "warning",
          duration: 5000
        });
        Cookies.remove("point");
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}
.login-form {
  width: 856px;
  height: 384px;
  display: flex;
  .login-form-left {
    width: 490px;
    height: 384px;
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    .logo1 {
      width: 314px;
      height: 85px;
      margin-bottom: 111px;
      margin-left: 42px;
    }
    .welcome {
      width: 384px;
      font-weight: 500;
      font-size: 28px;
      color: #fff;
      padding-bottom: 11px;
      padding-left: 16px;
      border-bottom: 1px solid #fff;
      display: flex;
      align-items: center;
      margin-left: 26px;
      img {
        width: 28px;
        height: 28px;
        margin-left: 19px;
      }
    }
    .title {
      margin: 16px 0 0 42px;
      font-size: 36px;
      color: #fff;
      font-weight: 600;
    }
  }
  .login-form-right {
    width: 366px;
    height: 384px;
    background: rgba($color: #000000, $alpha: 0.6);
    padding: 0 32px;
    box-sizing: border-box;
    .login-title {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
      margin-top: 20px;
      color: #fff;
      font-size: 16px;
    }
    .forget-password {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      font-size: 16px;
      color: #f7931e;
      padding-right: 10px;
      span {
        cursor: pointer;
      }
    }
    .login-input {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(221, 221, 221, 0.24);

      .pass {
        ::v-deep .el-input__inner {
          height: 50px;
          width: 173px;
          border: 0;
          border-radius: 0px;
          box-shadow: none;
          background: none;
          font-size: 16px;
          color: #fff;
        }
      }
      .login-code {
        display: flex;
        height: 50px;
        width: 97px;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 14px;
        color: #f7931e;
        position: relative;
        &::before {
          content: "";
          width: 1px;
          height: 16px;
          left: 0;
          top: 20px;
          background: rgba(221, 221, 221, 0.24);
          position: absolute;
        }
        .display {
          color: #333;
        }
      }
      .login-input-icon {
        width: 60px;
        height: 50px;
        //line-height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        &::before {
          content: " ";
          width: 1px;
          height: 20px;
          background-color: rgba(221, 221, 221, 0.24);
          right: 0;
          top: 15x;
          position: absolute;

          img {
            width: 24px;
            height: 24px;
          }
        }
      }
      ::v-deep .el-input__inner {
        height: 50px;
        width: 242px;
        border: 0;
        border-radius: 0px;
        box-shadow: none;
        background: none;
        font-size: 16px;
        color: #fff;
      }
    }
    .btn {
      width: 302px;
      height: 50px;
      background: #f7931e;
      border-radius: 8px;
      font-size: 18px;
      color: #fff;
      outline: none;
      border: none;
    }
  }
}
</style>
