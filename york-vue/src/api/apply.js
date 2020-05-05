import request from '@/utils/request'

export function getLastProcessDefList(query) {
  return request({
    url: '/apply/lastProcessDef/page',
    method: 'get',
    params: query
  })
}

export function startApply(processDefKey) {
  return request({
    url: '/apply/startApply',
    method: 'put',
    params: { processDefKey }
  })
}
export function getLeaveWaitApplyList(query) {
  return request({
    url: '/apply/getLeaveWaitApplyList/page',
    method: 'get',
    params: query
  })
}

export function queryLeaveBackApplyListByPage(query) {
  return request({
    url: '/apply/queryLeaveBackApplyListByPage/page',
    method: 'get',
    params: query
  })
}

export function applyLeaveProcess(data) {
  return request({
    url: '/apply/applyLeaveProcess',
    method: 'post',
    data
  })
}

export function cancelProcess(taskId) {
  return request({
    url: '/apply/cancelProcess',
    method: 'put',
    params: { taskId }
  })
}

export function queryProcess(processDefinitionId,processInstanceId) {
  return request({
    url: '/apply/queryProcess',
    method: 'get',
    params: { processDefinitionId,processInstanceId }
  })
}

export function queryApplyingListByPage(query) {
  return request({
    url: '/apply/queryApplyingListByPage/page',
    method: 'get',
    params: query
  })
}

export function queryCancelApplyListByPage(query) {
  return request({
    url: '/apply/queryCancelApplyListByPage/page',
    method: 'get',
    params: query
  })
}

export function queryFinishApplyListByPage(query) {
  return request({
    url: '/apply/queryFinishApplyListByPage/page',
    method: 'get',
    params: query
  })
}

export function getLeaveApplyData(taskInstanceId,taskDefinitionId) {
  return request({
    url: '/apply/getLeaveApplyData',
    method: 'get',
    params: { taskInstanceId,taskDefinitionId }
  })
}


