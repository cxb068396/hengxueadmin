import request from "@/utils/request";

export function getMemberList(selectForm) {
  return request({
    url: "/admin/member",
    method: "post",
    data: selectForm
  });
}

export function uploadPicture(data) {
  return request({
    url: "/admin/upload_picture",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data
  });
}
export function addMember(memberForm){
    return request({
        url:'/admin/add_member',
        method:'post',
        data:memberForm
    })
}

export function editMember(memberForm){
    return request({
        url:'/admin/edit_member',
        method:'post',
        data:memberForm
    })
}
export function followMember(id){
    return request({
        url:'/admin/follow_member',
        method:'post',
        data:{id}
    })
}

//admin/follow_member 跟踪用户状态暂时不做

export function getMemberInfo(id){
    return request({
        url:'/admin/get_member',
        method:'post',
        data:{id}
    })
}