import {
  apply,
  dealNode,
  rejectNode,
  rejectRootNode,
  pageMyPendingDeal,
  pageMyRecord,
  pageMyHasDeal,
  item,
  cancel,
  recordNodeByFlowRecordId,
  recordOperateLogByFlowRecordId,
  listBySchoolId,
  listByFlowId,
  myPowerApplyFlow
} from '@/api/processCenterApi'
const processCenter = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    //
    Apply ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        apply(params).then(res => {
          resolve(res)
        })
      })
    },
    DealNode ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        dealNode(params).then(res => {
          resolve(res)
        })
      })
    },
    RejectNode ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        rejectNode(params).then(res => {
          resolve(res)
        })
      })
    },
    RejectRootNode ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        rejectRootNode(params).then(res => {
          resolve(res)
        })
      })
    },
    PageMyPendingDeal ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        pageMyPendingDeal(params).then(res => {
          resolve(res)
        })
      })
    },
    PageMyRecord ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        pageMyRecord(params).then(res => {
          resolve(res)
        })
      })
    },
    PageMyHasDeal ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        pageMyHasDeal(params).then(res => {
          resolve(res)
        })
      })
    },
    Item ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        item(params).then(res => {
          resolve(res)
        })
      })
    },
    RecordNodeByFlowRecordId ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        recordNodeByFlowRecordId(params).then(res => {
          resolve(res)
        })
      })
    },
    RecordOperateLogByFlowRecordId ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        recordOperateLogByFlowRecordId(params).then(res => {
          resolve(res)
        })
      })
    },
    Cancel ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        cancel(params).then(res => {
          resolve(res)
        })
      })
    },
    ListBySchoolId ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        listBySchoolId(params).then(res => {
          resolve(res)
        })
      })
    },
    ListByFlowId ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        listByFlowId(params).then(res => {
          resolve(res)
        })
      })
    },
    MyPowerApplyFlow ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        myPowerApplyFlow(params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
export default processCenter
