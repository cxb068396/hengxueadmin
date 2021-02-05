import request from '@/utils/request'
import store from '../store'

export function login(username, password) {
  const params={
    username, password
  }
  return request({
    url: '/admin/login',
    method: 'get',
    params
  })
}

export function getInfo() {
  return request({
    url: '/admin/get_user',
    method: 'post',
    data:{
      token:store.getters.token
    }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'get'
  })
}
