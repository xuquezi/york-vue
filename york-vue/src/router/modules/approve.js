import Layout from '@/layout'

const approveRouter = {
  path: '/approve',
  component: Layout,
  redirect: '/approve/leaveApprove/leaveWaitApprove',
  name: 'Approve',
  meta: {
    title: '审批管理',
    icon: 'approve',
    roles: ['staff']
  },
  children: [
    {
      path: 'leaveApprove',
      component: () => import('@/views/approve/leaveApprove/index'),
      name: 'LeaveApprove',
      meta: { title: '请假流程审批', noCache: true },
      redirect: '/approve/leaveApprove/leaveWaitApprove',
      children: [
        {
          path: 'waitApprove',
          component: () => import('@/views/approve/leaveApprove/leaveWaitApprove'),
          name: 'WaitApprove',
          meta: { title: '待审批流程' }
        }
      ]
    }
  ]
}

export default approveRouter
