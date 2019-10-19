import request from '@/utils/request'

export function fetchOperateLogList(query) {
  return request({
    url: '/log/operate/page',
    method: 'get',
    params: query
  })
}
