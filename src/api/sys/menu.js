import request from "@/utils/request";

export function buildMenus() {
  return request({
    url: "/admin/checkpower",
    method: "post"
  });
}

export function getMenus(keyword) {
  return request({
    url: "/admin/menu",
    method: "post",
    data: {
      keyword
    }
  });
}

export function editMenus(id, status) {
  return request({
    url: "/admin/del_menu",
    method: "post",
    data: {
      id,
      status
    }
  });
}
export function detailMenus(id) {
  return request({
    url: "/admin/detail_menu",
    method: "post",
    data: {
      id
    }
  });
}

export function addMenus(title, pid, url, sort,icon) {
  return request({
    url: "/admin/add_menu",
    method: "post",
    data: {
      title,
      pid,
      url,
      sort,
      icon
    }
  });
}

export function reviseMenus(id, title, pid, url, sort,icon) {
  return request({
    url: "/admin/edit_menu",
    method: "post",
    data: {
      id,
      title,
      pid,
      url,
      sort,
      icon
    }
  });
}
