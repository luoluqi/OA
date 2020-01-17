import {getTree} from '@/api/workLogApi'
const workLog = {
    namespaced: true,
    state: {
      tree: [],
      workLogDetail: localStorage.workLogDetail ? JSON.parse(localStorage.workLogDetail) : {},
      workLogType: localStorage.workLogType ? localStorage.workLogType : ''
    },
    getters: {
    },
    mutations: {
      setWorkLog (state,log) {
        localStorage.workLogDetail = JSON.stringify(log)
        state.workLogDetail = log
      },
      setType (state, type) {
        localStorage.workLogType = type
        state.workLogType = type
      }
    },
    actions: {
      getTree ({state, rootGetters}) {
        return new Promise((resolve, reject) => {
          if (state.tree.length == 0) {
            getTree({
              schoolId: rootGetters.cookiesObj.schoolId
            }).then(res => {
              state.tree = res
              resolve(res)
            })
          } else {
            resolve(state.tree)
          }
         
        })
      }
    }
}
export default workLog
