import request from "@/utils/request";

export function getCustomer(phone, page, strip) {
  return request({
    url: "/admin/customer_service",
    method: "post",
    data: { phone, page, strip }
  });
}

export function addCustomer(nickname, number, id) {
  return request({
    url: "/admin/add_customer_service",
    method: "post",
    data: {
      nickname,
      number,
      id
    }
  });
}

export function delCustomer(id) {
  return request({
    url: "/admin/del_customer_service",
    method: "post",
    data: {
      id
    }
  });
}

export function editCustomer(nickname, number, id) {
  return request({
    url: "/admin/edit_customer_service",
    method: "post",
    data: {
      nickname,
      number,
      id
    }
  });
}


// 客服设置接口
export function getCustSetting(words) {
  return request({
    url: "/admin/common_words",
    method: "post",
    data: {
      words,
    }
  });
}

export function addCustSetting(description,words) {
  return request({
    url: "/admin/add_common_words",
    method: "post",
    data: {
      words,
      description,
    }
  });
}

export function editCustSetting(description,words, id) {
  return request({
    url: "/admin/edit_common_words",
    method: "post",
    data: {
      words,
      description,
      id,
    }
  });
}

export function delCustSetting(id) {
  return request({
    url: "/admin/del_common_words",
    method: "post",
    data: {
      id,
    }
  });
}

// 自动回复接口
export function getAnswer() {
  return request({
    url: "/admin/auto_reply",
    method: "post",
    data: {}
  });
}

export function editAnswer(time,status,words, id) {
  return request({
    url: "/admin/edit_auto_reply",
    method: "post",
    data: {time,status,words,id}
  });
}

// 会话规则
export function getSessionRules() {
  return request({
    url: "/admin/conversation_rule",
    method: "post",
    data: {}
  });
}

export function editSessionRules(status, time, id) {
  return request({
    url: "/admin/edit_conversation_rule",
    method: "post",
    data: {status, time, id}
  });
}