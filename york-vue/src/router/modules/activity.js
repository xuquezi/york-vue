/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const activityRouter = {
  path: '/activity',
  component: Layout,
  redirect: 'noredirect',
  name: 'Activity',
  meta: {
    title: 'activity',
    icon: 'activity',
    roles: ['admin']
  },
  children: [
    {
      path: 'processDef',
      component: () => import('@/views/activity/processDef'),
      name: 'ProcessDef',
      meta: { title: 'processDef', noCache: true }
    }
  ]
}

export default activityRouter
