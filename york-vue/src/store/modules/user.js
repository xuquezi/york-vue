import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  email: '',
  departmentName: '',
  departmentId: '',
  userId: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_DEPARTMENT_SERIAL: (state,departmentSerial) => {
    state.departmentSerial = departmentSerial
  },
  SET_DEPARTMENT_NAME: (state,departmentName) => {
    state.departmentName = departmentName
  },
  SET_USER_ID: (state,userId) => {
    state.userId = userId
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { user } = response
        if (!user) {
          reject('Verification failed, please Login again.')
        }
        const { roles, username, avatar,email,userSerial,department } = user
        if (!roles || roles.length <= 0) {
          reject('该用户无角色权限，请先配置!')
        }
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        commit('SET_EMAIL',email)
        commit('SET_DEPARTMENT_SERIAL',department.departmentSerial)
        commit('SET_DEPARTMENT_NAME',department.departmentName)
        commit('SET_USER_ID',userSerial)
        resolve(user)
      }).catch(error => {
        reject(error)
      })
    })
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])//清空角色
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

