import request from "@/utils/request";

// 咨询管理首页
// time: 0昨天 1最近七天 2最近三十天
// status:1已处理 2未处理
// page:页码
// strip：每页条数
export function getConsultList(data) {
  return request({
    url: "/admin/conversation_manage",
    method: "post",
    data: data
  });
}

// 会话历史首页
export function getHistories(data) {
  return request({
    url: "/admin/conversation_history",
    method: "post",
    data: data
  });
}

// 会话历史单个查看
export function getHistoryDetail(id) {
  return request({
    url: "/admin/read_conversation_history",
    method: "post",
    data: { id }
  });
}

// 会话统计首页
export function getStatistical(data) {
  return request({
    url: "/admin/statistical",
    method: "post",
    data: data
  });
}

// 聊天 绑定 client_id
export function bindClientId(id) {
  return request({
    url: "/admin/index/bind",
    method: "post",
    data: {
      client_id: id
    }
  });
}

export function send(data) {
  return request({
    url: "/admin/index/send",
    method: "post",
    data: data
  });
}

// 获取咨询者列表
export function queryConsult(name) {
  return request({
    url: "/admin/conversation_popup",
    method: "post",
    data: { name }
  });
}
