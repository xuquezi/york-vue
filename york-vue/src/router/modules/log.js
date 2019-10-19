/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const logsRouter = {
  path: '/logs',
  component: Layout,
  redirect: 'noredirect',
  name: 'Logs',
  meta: {
    title: 'logs',
    icon: 'logs',
    roles: ['admin']
  },
  children: [
    {
      path: 'operate',
      component: () => import('@/views/logs/operate'),
      name: 'Operate',
      meta: { title: 'operate', noCache: true }
    }
  ]
}

export default logsRouter
