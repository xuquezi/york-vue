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

export function deleteAllOperateLog() {
  return request({
    url: '/log/operate/deleteAllOperateLog',
    method: 'delete'
  })
}

export function fetchLoginLogList(query) {
  return request({
    url: '/log/login/page',
    method: 'get',
    params: query
  })
}

export function fetchLogoutLogList(query) {
  return request({
    url: '/log/logout/page',
    method: 'get',
    params: query
  })
}

export function deleteLoginLog(loginId) {
  return request({
    url: '/log/login/deleteLoginLog',
    method: 'delete',
    params: { loginId }
  })
}

export function deleteLogoutLog(logoutId) {
  return request({
    url: '/log/logout/deleteLogoutLog',
    method: 'delete',
    params: { logoutId }
  })
}

export function deleteSelectedLoginLog(data) {
  return request({
    url: '/log/login/deleteSelectedLoginLog',
    method: 'delete',
    data
  })
}

export function fetchTaskLogList(query) {
  return request({
    url: '/log/task/page',
    method: 'get',
    params: query
  })
}

export function deleteTaskLog(taskId) {
  return request({
    url: '/log/task/deleteTaskLog',
    method: 'delete',
    params: { taskId }
  })
}

export function deleteSelectedLogoutLog(data) {
  return request({
    url: '/log/logout/deleteSelectedLogoutLog',
    method: 'delete',
    data
  })
}

export function deleteSelectedTaskLog(data) {
  return request({
    url: '/log/task/deleteSelectedTaskLog',
    method: 'delete',
    data
  })
}
