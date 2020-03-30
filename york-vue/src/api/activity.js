import request from '@/utils/request'

export function queryProcessDefListByPage(query) {
  return request({
    url: '/activity/processDef/queryProcessDefListByPage',
    method: 'get',
    params: query
  })
}


export function deleteProcessDef(processDefDeploymentId) {
  return request({
    url: '/activity/processDef/deleteProcessDef',
    method: 'delete',
    params: { processDefDeploymentId }
  })
}

export function cascadeDeleteProcessDef(processDefDeploymentId) {
  return request({
    url: '/activity/processDef/cascadeDeleteProcessDef',
    method: 'delete',
    params: { processDefDeploymentId }
  })
}

export function deploy(processDefResourceName,processDeploymentName) {
  return request({
    url: '/activity/processDef/deploy',
    method: 'get',
    params: { processDefResourceName,processDeploymentName }
  })
}
