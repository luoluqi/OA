import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/themes/cvue/layout/index'
import store from '../store'

Vue.use(Router)
// 路由实例
const router = new Router({
  scrollBehavior (to, from, savedPosition) {
    // 路由滚动行为
    if (savedPosition) {
      return savedPosition
    } else {
      const position = {}
      if (to.hash) {
        position.selector = to.hash
      }
      if (to.matched.some(m => m.meta.scrollToTop)) {
        position.x = 0
        position.y = 0
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(position)
        }, 500)
      })
    }
  },
  routes: [
    {
      path: '/index',
      redirect: '/index/add-exam',
      name: 'Index',
      component: () =>
        import(
          /* webpackChunkName: "group-foo" */ '../themes/cvue/layout/index'
        ),
      children: [
        {
          path: 'home',
          name: '首页',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/interflow/home'
            ),
          meta: {
            title: '首页'
          }
        },
        {
          path: 'course',
          name: '课程表',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/interflow/course'
            ),
          meta: {
            title: '课程表'
          }
        },
        {
          path: 'add-exam',
          name: '添加考试',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/interflow/addExam'
            ),
          meta: {
            title: '添加考试'
          }
        },
        {
          path: 'record-score',
          name: '录入成绩',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/interflow/recordScore'
            ),
          meta: {
            title: '录入成绩'
          }
        },
        {
          path: 'query-score',
          name: '查询成绩',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/interflow/queryScore'
            ),
          meta: {
            title: '查询成绩'
          }
        },
        {
          path: 'email',
          name: '电子邮件',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/email/index'
            ),
          meta: {
            title: '电子邮件'
          }
        },
        {
          path: 'schedule',
          name: '日程安排',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/schedule/index'
            ),
          meta: {
            title: '日程安排'
          }
        },
        {
          path: 'notice',
          name: '通知公告',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/notice/index'
            ),
          meta: {
            title: '通知公告'
          }
        },
        {
          path: 'payroll',
          name: '工资条',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/payroll/index'
            ),
          meta: {
            title: '工资条'
          }
        },
        {
          path: 'lookPayroll',
          name: '历史记录',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/payroll/lookPayroll'
            ),
          meta: {
            title: '历史记录'
          }
        },
        {
          path: 'shortNote',
          name: '便签',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/shortNote/index'
            ),
          meta: {
            title: '便签'
          }
        },
        {
          path: 'email-write',
          name: '写信',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/email/emailWrite'
            ),
          meta: {
            title: '写信'
          }
        },
        {
          path: 'email-edit',
          name: '编辑邮件',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/email/emailEdit'
            ),
          meta: {
            title: '编辑邮件'
          }
        },
        {
          path: 'file',
          name: '个人文件柜',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/file/list'
            ),
          meta: {
            title: '个人文件柜'
          }
        },
        {
          path: 'addressBook',
          name: '通讯录',
          component: () =>
            import(
              /* webpackChunkName: "group-foo" */ '../themes/cvue/views/addressBook/index'
            ),
          meta: {
            title: '通讯录'
          }
        }
      ]
    },
    {
      path: '/work-flow',
      name: 'workFlow',
      component: () =>
        import(
          /* webpackChunkName: "group-foo" */ '../themes/cvue/layout/index'
        ),
      children: [
        {
          path: 'index',
          name: '我的流程',
          component: () =>
            import('../themes/cvue/views/workFlow/processCenter/index'),
          meta: {
            title: '我的流程'
          }
        },
        {
          path: 'indexProcessed',
          name: '已处理流程',
          component: () =>
            import(
              '../themes/cvue/views/workFlow/processCenter/indexProcessed'
            ),
          meta: {
            title: '已处理流程'
          }
        },
        {
          path: 'indexPendingProcess',
          name: '待处理流程',
          component: () =>
            import(
              '../themes/cvue/views/workFlow/processCenter/indexPendingProcess'
            ),
          meta: {
            title: '待处理流程'
          }
        },
        {
          path: 'form-design',
          name: '表单设计',
          component: () => import('../themes/cvue/views/workFlow/form/formDesign'),
          meta: {
            title: '表单设计'
          }
        },
        {
          path: 'workflow-design',
          name: '流程设计',
          component: () => import('../themes/cvue/views/workFlow/flow/workFlowDesign'),
          meta: {
            title: '流程设计'
          }
        }
      ]
    },
    {
      path: '/workLog',
      name: 'workLog',
      component: () =>
        import(
          /* webpackChunkName: "group-foo" */ '../themes/cvue/layout/index'
        ),
      children: [
        {
          path: 'index',
          name: '工作日志',
          component: () => import('../themes/cvue/views/workLog/index'),
          meta: {
            title: '工作日志'
          }
        },
        {
          path: 'add',
          name: '添加工作日志',
          component: () => import('../themes/cvue/views/workLog/add'),
          meta: {
            title: '添加工作日志'
          }
        },
        {
          path: 'detail',
          name: '工作日志详情',
          component: () => import('../themes/cvue/views/workLog/detail'),
          meta: {
            title: '工作日志详情'
          }
        }
      ]
    },
    {
      path: '/publicFile',
      name: 'publicFile',
      component: () =>
        import(
          /* webpackChunkName: "group-foo" */ '../themes/cvue/layout/index'
        ),
      children: [
        {
          path: 'list',
          name: '公共文件柜',
          component: () => import('../themes/cvue/views/publicFile/list'),
          meta: {
            title: '公共文件柜'
          }
        },
        {
          path: 'root',
          name: '公共文件柜设置',
          component: () => import('../themes/cvue/views/publicFile/root'),
          meta: {
            title: '公共文件柜设置'
          }
        }
      ]
    },
    {
      path: '/',
      redirect: '/index/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: () =>
        import(/* webpackChunkName: "group-foo" */ '../themes/login/Login')
    },
    {
      path: '*',
      redirect: '/error/404'
    },
    {
      path: '/error/403',
      name: 'Error403',
      component: () =>
        import(/* webpackChunkName: "group-foo" */ '../themes/error/403')
    },
    {
      path: '/error/404',
      name: 'Error404',
      component: () =>
        import(/* webpackChunkName: "group-foo" */ '../themes/error/404')
    }
  ]
})
router.beforeEach((to, from, next) => {
  store
    .dispatch('common/GgetTokenByPC', '')
    .then(res => {
      // console.log(JSON.parse(res))
      next()
    })
    .catch(error => {
      next()
    })
})
router.afterEach((to, from) => {
  window.document.title = to.meta.title
})
export default router
