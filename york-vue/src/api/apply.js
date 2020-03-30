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

export function applyLeaveProcess(data) {
  return request({
    url: '/apply/applyLeaveProcess',
    method: 'post',
    data
  })
}

export function cancelProcess(processTaskId) {
  return request({
    url: '/apply/cancelProcess',
    method: 'put',
    params: { processTaskId }
  })
}

export function fetchApplyingList(query) {
  return request({
    url: '/apply/getApplyingList/page',
    method: 'get',
    params: query
  })
}

export function getLeaveWaitApproveList(query) {
  return request({
    url: '/apply/getLeaveWaitApproveList/page',
    method: 'get',
    params: query
  })
}

export function getLeaveApplyData(processTaskInstanceId,processTaskDefinitionId) {
  return request({
    url: '/apply/getLeaveApplyData',
    method: 'get',
    params: { processTaskInstanceId,processTaskDefinitionId }
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

