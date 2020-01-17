import { pageBySchoolId, update, add, flowDelete, upFlowState, item, listBySchoolId, myPowerApplyFlow, flowNodeAppend, flowNodeInsert, flowNodeUpdate, flowNodeDelete, flowNodeItem, listByFlowId, updateParentIds, canDeleteForm, upFlowFormId, deleteByFlowId, flowNodeConditionAdd, conditionListByNodeId, flowNodeConditionItem, flowNodeConditionUpdate, flowNodeConditionDelete } from '@/api/workFlowApi'
const workFlow = {
    namespaced: true,
    state: {

    },
    getters: {
    },
    mutations: {
    },
    actions: {
      Add ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          add(params).then(res => {
                resolve(res)
            })
        })
      },
      Update ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          update(params).then(res => {
                resolve(res)
            })
        })
      },
      FlowDelete ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowDelete(params).then(res => {
                resolve(res)
            })
        })
      },
      UpFlowState ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          upFlowState(params).then(res => {
                resolve(res)
            })
        })
      },
      Item ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          item(params).then(res => {
                resolve(res)
            })
        })
      },
      ListBySchoolId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          listBySchoolId(params).then(res => {
                resolve(res)
            })
        })
      },      
      PageBySchoolId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          pageBySchoolId(params).then(res => {
                resolve(res)
            })
        })
      },      
      MyPowerApplyFlow ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          myPowerApplyFlow(params).then(res => {
                resolve(res)
            })
        })
      }, 
      FlowNodeAppend ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowNodeAppend(params).then(res => {
                resolve(res)
            })
        })
      }, 
      FlowNodeInsert ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowNodeInsert(params).then(res => {
                resolve(res)
            })
        })
      }, 
      FlowNodeUpdate ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowNodeUpdate(params).then(res => {
                resolve(res)
            })
        })
      },
      UpdateParentIds ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          updateParentIds(params).then(res => {
                resolve(res)
            })
        })
      },
      FlowNodeDelete ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowNodeDelete(params).then(res => {
                resolve(res)
            })
        })
      },
      FlowNodeItem ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowNodeItem(params).then(res => {
                resolve(res)
            })
        })
      },
      ListByFlowId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          listByFlowId(params).then(res => {
                resolve(res)
            })
        })
      },
      CanDeleteForm ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          canDeleteForm(params).then(res => {
                resolve(res)
            })
        })
      },
      UpFlowFormId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          upFlowFormId(params).then(res => {
                resolve(res)
            })
        })
      },
      DeleteByFlowId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          deleteByFlowId(params).then(res => {
                resolve(res)
            })
        })
      },
      FlowNodeConditionAdd ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowNodeConditionAdd(params).then(res => {
                resolve(res)
            })
        })
      },
      ConditionListByNodeId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          conditionListByNodeId(params).then(res => {
                resolve(res)
            })
        })
      },
      FlowNodeConditionItem ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowNodeConditionItem(params).then(res => {
                resolve(res)
            })
        })
      },
      FlowNodeConditionUpdate ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowNodeConditionUpdate(params).then(res => {
                resolve(res)
            })
        })
      },
      FlowNodeConditionDelete ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          flowNodeConditionDelete(params).then(res => {
                resolve(res)
            })
        })
      }
    }
}
export default workFlow
