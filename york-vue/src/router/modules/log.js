/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const logsRouter = {
  path: '/logs',
  component: Layout,
  redirect: 'noredirect',
  name: 'Logs',
  meta: {
    title: '日志管理',
    icon: 'logs',
    roles: ['admin']
  },
  children: [
    {
      path: 'login',
      component: () => import('@/views/logs/login'),
      name: 'Login',
      meta: { title: '登录日志', noCache: true }
    },
    {
      path: 'logout',
      component: () => import('@/views/logs/logout'),
      name: 'Logout',
      meta: { title: '登出日志', noCache: true }
    },
    {
      path: 'operate',
      component: () => import('@/views/logs/operate'),
      name: 'Operate',
      meta: { title: '操作日志', noCache: true }
    },
    {
      path: 'task',
      component: () => import('@/views/logs/task'),
      name: 'Task',
      meta: { title: '定时任务日志', noCache: true }
    }
  ]
}

export default logsRouter
