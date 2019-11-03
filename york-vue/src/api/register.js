import request from '@/utils/request'

export function queryUsername(username) {
  return request({
    url: '/register/validateUsername',
    method: 'get',
    params: { username }
  })
}

export function queryEmail(email) {
  return request({
    url: '/register/validateEmail',
    method: 'get',
    params: { email }
  })
}

export function sendCode(tel) {
  return request({
    url: '/register/sendCode',
    method: 'get',
    params: { tel }
  })
}
