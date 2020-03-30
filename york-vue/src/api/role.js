import request from '@/utils/request'

export function queryRoleList() {
  return request({
    url: '/role/queryRoleList',
    method: 'get'
  })
}

export function queryRoleListByPage(query) {
  return request({
    url: '/role/queryRoleListByPage',
    method: 'get',
    params: query
  })
}

export function stopOrUseRole(roleSerial,status) {
  return request({
    url: '/role/stopOrUseRole',
    method: 'put',
    params: { roleSerial,status }
  })
}

export function deleteRoleByRoleSerial(roleSerial) {
  return request({
    url: '/role/deleteRoleByRoleSerial',
    method: 'delete',
    params: { roleSerial }
  })
}

export function updateRole(data) {
  return request({
    url: '/role/updateRole',
    method: 'put',
    data
  })
}

export function createRole(data) {
  return request({
    url: '/role/createRole',
    method: 'post',
    data
  })
}
