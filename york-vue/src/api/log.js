import request from '@/utils/request'

export function queryOperateLogByPage(query) {
  return request({
    url: '/log/operate/queryOperateLogByPage',
    method: 'get',
    params: query
  })
}

export function deleteSelectedOperateLog(data) {
  return request({
    url: '/log/operate/deleteSelectedOperateLog',
    method: 'delete',
    data
  })
}

export function deleteOperateLog(id) {
  return request({
    url: '/log/operate/deleteOperateLog',
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

export function queryLoginLogByPage(query) {
  return request({
    url: '/log/login/queryLoginLogByPage',
    method: 'get',
    params: query
  })
}

export function queryLogoutLogByPage(query) {
  return request({
    url: '/log/logout/queryLogoutLogByPage',
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

export function queryTaskLogByPage(query) {
  return request({
    url: '/log/task/queryTaskLogByPage',
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
