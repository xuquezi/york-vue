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

export function queryUserListByPage(query) {
  return request({
    url: '/user/queryUserListByPage',
    method: 'get',
    params: query
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'put',
    data
  })
}

export function stopOrUseUser(userSerial,status) {
  return request({
    url: '/user/stopOrUseUser',
    method: 'put',
    params: { userSerial,status }
  })
}

export function deleteUserByUserSerial(userSerial) {
  return request({
    url: '/user/deleteUserByUserSerial',
    method: 'delete',
    params: { userSerial }
  })
}

export function createUser(data) {
  return request({
    url: '/user/createUser',
    method: 'post',
    data
  })
}

export function queryAllUserList() {
  return request({
    url: '/user/queryAllUserList',
    method: 'get'
  })
}

export function queryUserByDepartmentSerial(departmentSerial) {
  return request({
    url: '/user/queryUserByDepartmentSerial',
    method: 'get',
    params: { departmentSerial }
  })
}

export function queryUserArrayByDepartmentSerial(departmentSerial) {
  return request({
    url: '/user/queryUserArrayByDepartmentSerial',
    method: 'get',
    params: { departmentSerial }
  })
}

