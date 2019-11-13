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

export function queryTel(tel) {
  return request({
    url: '/register/validateTel',
    method: 'get',
    params: { tel }
  })
}

export function sendCode(tel) {
  return request({
    url: '/register/sendCode',
    method: 'get',
    params: { tel }
  })
}

export function registerUser(data) {
  return request({
    url: '/register/registerUser',
    method: 'post',
    data
  })
}
