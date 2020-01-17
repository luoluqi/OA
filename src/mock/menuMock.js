// import Mock from 'mockjs'
let menu = {
  admin: [
      {
        id: 1,
        label: '订单中心',
        href: '',
        icon: 'fa fa-home',
        permission: ['view', 'add', 'delete', 'edit'],
        show: true,
        children: [
          {
            id: 12,
            label: '学校订单',
            href: '/order/school-order',
            icon: 'fa fa-file-text',
            permission: ['view', 'add', 'delete', 'edit'],
            show: true,
            children: []
          },
          {
            id: 13,
            label: '个人订单',
            href: '/order/personal-order',
            icon: 'fa fa-file-text',
            permission: ['view', 'add', 'delete', 'edit'],
            show: true,
            children: []
          }
          // {
          //   id: 14,
          //   label: '个人订单',
          //   href: '/order/test',
          //   icon: 'fa fa-file-text',
          //   permission: ['view', 'add', 'delete', 'edit'],
          //   show: true,
          //   children: []
          // }
        ]
      }
  ],
  user: [
    {
        id: 1,
        label: '首页',
        href: '/index/home',
        icon: 'fa fa-home',
        permission: ['view', 'add', 'delete', 'edit'],
        show: true,
        children: []
    }
  ]
}
// Mock.mock(/\/user\/menu/, 'post', menu)
export default menu
