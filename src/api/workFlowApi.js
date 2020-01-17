import axios from './axios'
import qs from 'qs'
import {workFlowUrl} from '@/config/config'
// 添加流程  流程节点和节点条件不在这里新增
export const add = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workFlowUrl + '/api/Flow/Add',
            method: 'post',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

// 修改流程基本信息
export const update = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workFlowUrl + '/api/Flow/Update',
            method: 'post',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

// 修改状态为删除 deleteFlag=true
export const flowDelete = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/Flow/Delete',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 修改状态
export const upFlowState = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/Flow/UpFlowState',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 根据id获取详情
export const item = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workFlowUrl + '/api/Flow/Item',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}
// 读取某个学校下所有的流程
export const listBySchoolId = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workFlowUrl + '/api/Flow/ListBySchoolId',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

// 根据学校Id， 登录id 获取日程列表
export const pageBySchoolId = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/Flow/PageBySchoolId',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 获取当前用户能够申请的所有流程
export const myPowerApplyFlow = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/Flow/MyPowerApplyFlow',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 新增某个流程节点
export const flowNodeAppend = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNode/Append',
          method: 'post',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 两个节点之间插入某个流程节点
export const flowNodeInsert = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNode/Insert',
          method: 'post',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 修改某个流程节点 parentids不能修改
export const flowNodeUpdate = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNode/Update',
          method: 'post',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 修改某个节点的父级节点
export const updateParentIds = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNode/UpdateParentIds',
          method: 'post',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 根据id删除某个节点
export const flowNodeDelete = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNode/Delete',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 根据id获取详情
export const flowNodeItem = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNode/Item',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 根据流程id读取所有节点
export const listByFlowId = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNode/ListByFlowId',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 判断某个表单是否可以删除
export const canDeleteForm = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/Flow/CanDeleteForm',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 修改流程对应表单
export const upFlowFormId = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/Flow/UpFlowFormId',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 根据流程id删除所有条件
export const deleteByFlowId = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNodeCondition/DeleteByFlowId',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 添加节点条件
export const flowNodeConditionAdd = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNodeCondition/Add',
          method: 'post',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 更新节点条件
export const flowNodeConditionUpdate = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNodeCondition/Update',
          method: 'post',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 获取某个节点下的所有条件 多个条件 ||
export const conditionListByNodeId = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNodeCondition/ListByNodeId',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 根据id获取详情
export const flowNodeConditionItem = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNodeCondition/Item',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 根据id删除某个节点的条件
export const flowNodeConditionDelete = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: workFlowUrl + '/api/FlowNodeCondition/Delete',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}
