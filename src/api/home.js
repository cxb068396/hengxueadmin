import request from '@/utils/request'

export function getHomeData(){
  return request ({
    url: '/admin/sye',
    method: 'post',
  })
}