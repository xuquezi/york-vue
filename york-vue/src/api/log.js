import request from '@/utils/request'

export function fetchOperateLogList(query) {
  return request({
    url: '/log/operate/page',
    method: 'get',
    params: query
  })
}

export function deleteSelected(data) {
  return request({
    url: '/log/operate/deleteSelected',
    method: 'delete',
    data
  })
}

export function deleteLog(id) {
  return request({
    url: '/log/operate/deleteLog',
    method: 'delete',
    params: { id }
  })
}

export function fetchLoginLogList(query) {
  return request({
    url: '/log/login/page',
    method: 'get',
    params: query
  })
}

