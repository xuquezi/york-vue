import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function fetchRoleList(query) {
  return request({
    url: '/role/page',
    method: 'get',
    params: query
  })
}

export function stopAndUseRole(roleId,status) {
  return request({
    url: '/role/stopAndUseRole',
    method: 'put',
    params: { roleId,status }
  })
}
