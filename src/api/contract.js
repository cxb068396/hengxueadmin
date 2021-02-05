import request from '@/utils/request'

export function getContracts(data){
  return request ({
    url: '/admin/contract',
    method: 'post',
    data: data
  })
}
export function uploadContracts(data){
  return request ({
    url: '/admin/upload_contract',
    method: 'post',
    headers: { "Content-Type": "multipart/form-data" },
    data: data
  })
}

export function downloadContracts(id){
  return request ({
    url: '/admin/down_contract',
    method: 'post',
    responseType: 'arraybuffer',
    data: {id}
  })
}

// 根据手机号返回客户姓名和方案中的产品
export function getProduct(phone){
  return request ({
    url: '/admin/get_product',
    method: 'post',
    data: {phone}
  })
}

// 保存合同
export function saveContract(data){
  return request ({
    url: '/admin/save_contract',
    method: 'post',
    data
  })
}

// 发起签约
export function signProduct(id){
  return request ({
    url: '/admin/sign_product',
    method: 'post',
    data: {id}
  })
}

// 编辑合同
export function editContract(data){
  return request({
    url: '/admin/edit_contract',
    method: 'post',
    data
  })
}

// 获得单个合同的相关信息
export function getContract(id){
  return request({
    url: '/admin/get_contract',
    method: 'post',
    data: {id}
  })
}

// 作废合同
export function voidContract(id){
  return request({
    url: '/admin/void_contract',
    method: 'post',
    data: {id}
  })
}
