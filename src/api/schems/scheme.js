import request from "@/utils/request";

// 获取方案列表
export function getScheme(query){
  return request({
    url: "/admin/scheme",
    method: "post",
    data: query
  });
}

// 获取下拉列表内容
export function getSchemeDetail(id){
  return request({
    url: "/admin/detail_scheme",
    method: "post",
    data: {id}
  });
}

// 新增方案
export function addScheme(data){
  return request({
    url: "/admin/add_scheme",
    method: "post",
    data: data
  });
}

// 编辑方案
export function editScheme(data){
  return request({
    url: "/admin/edit_scheme",
    method: "post",
    data: data
  });
}
//添加图片
// 编辑方案
export function addPicture(data){
  return request({
    url: "/admin/upload_img_scheme",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data: data
  });
}

export function exportScheme(id){
  return request({
    url: "/admin/scheme_word",
    method: "post",
    responseType: 'arraybuffer',
    data: {id}
  });
}
