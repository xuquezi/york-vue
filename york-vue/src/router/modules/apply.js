import Layout from '@/layout'

const applyRouter = {
  path: '/apply',
  component: Layout,
  redirect: '/apply/leaveApply/leaveWaitApply',
  name: 'Apply',
  meta: {
    title: 'apply',
    icon: 'apply',
    roles: ['staff']
  },
  children: [
    {
      path: 'leaveApply',
      component: () => import('@/views/apply/leaveApply/index'),
      name: 'LeaveApply',
      meta: { title: 'leaveApply', noCache: true },
      redirect: '/apply/leaveApply/leaveWaitApply',
      children: [
        {
          path: 'waitApply',
          component: () => import('@/views/apply/leaveApply/leaveWaitApply'),
          name: 'WaitApply',
          meta: { title: 'waitApply' }
        },
        {
          path: 'applying',
          component: () => import('@/views/apply/leaveApply/leaveApplying'),
          name: 'Applying',
          meta: { title: 'applying' }
        }
      ]
    },
    {
      path: 'newApply',
      component: () => import('@/views/apply/newApply/index'),
      name: 'NewApply',
      meta: {title: 'newApply', noCache: true}
    }
  ]
}

export default applyRouter
