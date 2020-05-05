import request from '@/utils/request'

export function validUsername(username) {
  return request({
    url: '/valid/validateUsername',
    method: 'get',
    params: { username }
  })
}

export function validEmail(email) {
  return request({
    url: '/valid/validateEmail',
    method: 'get',
    params: { email }
  })
}

export function validMobile(mobile) {
  return request({
    url: '/valid/validateMobile',
    method: 'get',
    params: { mobile }
  })
}

export function validRoleName(roleName) {
  return request({
    url: '/valid/validateRoleName',
    method: 'get',
    params: { roleName }
  })
}

export function validDepartmentName(departmentName) {
  return request({
    url: '/valid/validDepartmentName',
    method: 'get',
    params: { departmentName }
  })
}
