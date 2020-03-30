import Layout from '@/layout'

const applyRouter = {
  path: '/apply',
  component: Layout,
  redirect: '/apply/leaveApply/leaveWaitApply',
  name: 'Apply',
  meta: {
    title: '申请审批',
    icon: 'apply',
    roles: ['staff']
  },
  children: [
    {
      path: 'leaveApply',
      component: () => import('@/views/apply/leaveApply/index'),
      name: 'LeaveApply',
      meta: { title: '请假流程申请', noCache: true },
      redirect: '/apply/leaveApply/leaveWaitApply',
      children: [
        {
          path: 'waitApply',
          component: () => import('@/views/apply/leaveApply/leaveWaitApply'),
          name: 'WaitApply',
          meta: { title: '待提交申请' }
        },
        {
          path: 'waitApprove',
          component: () => import('@/views/apply/leaveApply/leaveWaitApprove'),
          name: 'WaitApprove',
          meta: { title: '待审批申请' }
        }
      ]
    },
    {
      path: 'newApply',
      component: () => import('@/views/apply/newApply/index'),
      name: 'NewApply',
      meta: {title: '新建流程申请', noCache: true}
    },
    {
      path: 'applying',
      component: () => import('@/views/apply/applying/index'),
      name: 'Applying',
      meta: {title: '申请中流程', noCache: true}
    }
  ]
}

export default applyRouter
