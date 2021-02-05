import request from "@/utils/request";

export function getProducrList(selectForm) {
  return request({
    url: "/admin/product",
    method: "post",
    data: selectForm
  });
}

export function addProducrt(selectForm) {
    return request({
      url: "/admin/add_product",
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      data: selectForm
    });
  }
  export function editProducrt(selectForm) {
    return request({
      url: "/admin/edit_product",
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      data: selectForm
    });
  }
  
  
  export function detailProducrt(id) {
    return request({
      url: "/admin/detail_product ",
      method: "post",
      data:{id}
    });
  }