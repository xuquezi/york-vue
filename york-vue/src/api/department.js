import request from '@/utils/request'

export function queryDepartmentListByPage(query) {
  return request({
    url: '/department/queryDepartmentListByPage',
    method: 'get',
    params: query
  })
}

export function queryDepartmentLevel() {
  return request({
    url: '/department/queryDepartmentLevel',
    method: 'get'
  })
}

export function queryDepartmentByParentLevel(levelString) {
  return request({
    url: '/department/queryDepartmentByParentLevel',
    method: 'get',
    params: { levelString }
  })
}

export function createDepartment(data) {
  return request({
    url: '/department/createDepartment',
    method: 'post',
    data
  })
}

export function queryDepartmentList() {
  return request({
    url: '/department/queryDepartmentList',
    method: 'get'
  })
}

export function updateDepartment(data) {
  return request({
    url: '/department/updateDepartment',
    method: 'put',
    data
  })
}

export function deleteDepartmentByDepartmentSerial(departmentSerial) {
  return request({
    url: '/department/deleteDepartmentByDepartmentSerial',
    method: 'delete',
    params: { departmentSerial }
  })
}

export function departmentUserQuery(departmentSerial) {
  return request({
    url: '/department/departmentUserQuery',
    method: 'get',
    params: { departmentSerial }
  })
}
