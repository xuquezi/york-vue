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

export function queryLeaveWaitApproveListByPage(query) {
  return request({
    url: '/apply/queryLeaveWaitApproveListByPage/page',
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

// 一定要是data，写死不然传不过去数据
export function agreeLeaveApply(data) {
  return request({
    url: '/apply/agreeLeaveApply',
    method: 'put',
    data
  })
}

export function backLeaveApply(data) {
  return request({
    url: '/apply/backLeaveApply',
    method: 'put',
    data
  })
}

