import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/user/page',
    method: 'get',
    params: query
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

export function stopAndUse(userId,status) {
  return request({
    url: '/user/stopAndUse',
    method: 'put',
    params: { userId,status }
  })
}

export function activate(userId) {
  return request({
    url: '/user/activate',
    method: 'put',
    params: { userId }
  })
}

export function deleteUser(userId) {
  return request({
    url: '/user/deleteUser',
    method: 'delete',
    params: { userId }
  })
}

