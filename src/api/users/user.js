import request from "@/utils/request";

// 删除用户
export function delUser(id) {
  return request({
    url: "/admin/del_user",
    method: "post",
    data: { id }
  });
}

// 添加用户
export function addUser(user) {
  return request({
    url: "/admin/add_user",
    method: "post",
    data: user
  });
}

// 编辑用户
export function editUser(user) {
  return request({
    url: "/admin/edit_user",
    method: "post",
    data: user
  });
}

// 重置密码
export function resetPass(id, password) {
  return request({
    url: "/admin/reset_password",
    method: "post",
    data: { id, password }
  });
}

// 查询用户
export function queryUser(search){
  return request({
    url: "/admin/user",
    method: "post",
    data: search
  });
}

// 获取城市相关数据
export function queryCitys(){
  return request({
    url: "/admin/get_city",
    method: "post",
  });
}