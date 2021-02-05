import { login, getInfo, logout } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { getUnreadMessage } from "@/api/information/informations";
// import {Message} from 'element-ui'
import dayjs from "dayjs";
const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false,
    hiteMessage: [],
    showHiteMessage: false
    //isLogin:false //设置登录标识符
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus;
    },
    // CHANGE_LOGIN:(state,isLogin)=>{
    //   state.isLogin=isLogin
    // },
    toggleShowHiteMessage(state) {
      state.showHiteMessage = !state.showHiteMessage;
      // console.log(state.showHiteMessage);
    },
    SET_HITE_MES: (state, hiteMessage) => {
      state.hiteMessage = hiteMessage;
    },
    Minus_Hite_Mes: (state, id) => {
      state.hiteMessage = state.hiteMessage.filter(ele => ele.id === id);
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // const rememberMe = userInfo.rememberMe
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(res => {
            // setToken(res.token, rememberMe)
            console.log(res.mes.token);
            setToken(res.mes.token);
            commit("SET_TOKEN", res.mes.token);
            // commit('CHANGE_LOGIN',true) //在登录的情况下将isLogin设置为true
            setUserInfo(res.mes, commit);
            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            commit("SET_LOAD_MENUS", true);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            setUserInfo(res.mes, commit);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(res => {
            logOut(commit);
            // commit('CHANGE_LOGIN',fasle) //登出之后将isLogin设置为false
            resolve();
          })
          .catch(error => {
            logOut(commit);
            reject(error);
          });
      });
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit("SET_LOAD_MENUS", false);
      });
    },

    // 获取用户消息
    GetHiteMes({ commit }) {
      getUnreadMessage().then(res => {
        // console.log(res)
        if (res && res.mes.list && Array.isArray(res.mes.list)) {
          let mes = res.mes.list.map(({ cate, content, id, title, update_time }) => {
            return {
              id,
              title,
              message: content,
              time: dayjs(update_time).format("MM-DD HH:mm"),
              url: "#",
              cate
            };
          });
          commit("SET_HITE_MES", mes);
        }
      });
    }
  }
};

export const logOut = commit => {
  commit("SET_TOKEN", "");
  commit("SET_ROLES", []);
  removeToken();
};

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit("SET_ROLES", ["ROLE_SYSTEM_DEFAULT"]);
  } else {
    commit("SET_ROLES", res.roles);
  }
  commit("SET_USER", res.user);
};

export default user;
