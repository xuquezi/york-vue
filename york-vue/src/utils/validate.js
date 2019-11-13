/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
import { queryUsername,queryEmail,queryTel } from '@/api/register'
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(username) {
  //这里要用promise的写法，才会同步返回数据.
  return new Promise((resolve, reject) => {
    queryUsername(username).then(response =>{
      const usernameFlag = response.flag
      // console.log(usernameFlag)
      resolve(usernameFlag)
    }).catch(error => {
      reject(error)
    })
  })
}

export function validEmail(email) {
  //这里要用promise的写法，才会同步返回数据.
  return new Promise((resolve, reject) => {
    queryEmail(email).then(response =>{
      const emailFlag = response.flag
      resolve(emailFlag)
    }).catch(error => {
      reject(error)
    })
  })
}

export function validTel(tel) {
  //这里要用promise的写法，才会同步返回数据.
  return new Promise((resolve, reject) => {
    queryTel(tel).then(response =>{
      const telFlag = response.flag
      resolve(telFlag)
    }).catch(error => {
      reject(error)
    })
  })
}
