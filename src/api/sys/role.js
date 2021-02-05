import request from "@/utils/request";

export function getRoles(page, keyword, strip) {
  return request({
    url: "/admin/group",
    method: "post",
    data: {
      page,
      keyword,
      strip //每页显示条数，默认为10条
    }
  });
}

export function addRoles(title, sort, description) {
  return request({
    url: "/admin/add_group",
    method: "post",
    data: {
      title,
      sort,
      description
    }
  });
}

export function editRoles(id, title, sort, description) {
  return request({
    url: "/admin/edit_group",
    method: "post",
    data: {
      id,
      title,
      sort,
      description
    }
  });
}

export function delRoles(id) {
  return request({
    url: "/admin/del_group",
    method: "post",
    data: {
      id
    }
  });
}

/**
 * 获取所有的角色和菜单
 */
export function getPower() {
  return request({
    url: "admin/power",
    method: "post"
  });
}

/**
 * 修改权限
 * @param {string} id 角色id
 * @param {array} rules 选中的规则（使用英文状态下的“,"逗号隔开）
 */
export function savepurview(id, rules) {
  return request({
    url: "admin/save_power",
    method: "post",
    data: {
      id,
      rules: rules.join(",")
    }
  });
}

//  操作日志
export function getLogs(page, strip = 10, username, date_start, date_end) {
  return request({
    url: "admin/logs",
    method: "post",
    data: {
      page,
      strip,
      username,
      date_start,
      date_end
    }
  });
}

// 删除日志
export function delLogs(id) {
  return request({
    url: "admin/del_logs",
    method: "post",
    data: {
      id
    }
  });
}
