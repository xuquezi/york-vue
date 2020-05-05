import request from '@/utils/request'

export function queryLeaveWaitApproveListByPage(query) {
  return request({
    url: '/approve/queryLeaveWaitApproveListByPage/page',
    method: 'get',
    params: query
  })
}

// 一定要是data，写死不然传不过去数据
export function agreeLeaveApply(data) {
  return request({
    url: '/approve/agreeLeaveApply',
    method: 'put',
    data
  })
}

export function backLeaveApply(data) {
  return request({
    url: '/approve/backLeaveApply',
    method: 'put',
    data
  })
}
