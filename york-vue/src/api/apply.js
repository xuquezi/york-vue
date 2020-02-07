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
export function getTaskList(query) {
  return request({
    url: '/apply/getTaskList/page',
    method: 'get',
    params: query
  })
}


