import axios from './axios'
import qs from 'qs'
import { processCenterUrl } from '@/config/config'
// export const editTeachSalaryGroup = params => {
//   return new Promise((resolve, reject) => {
//     axios({
//       url: payrollUrl + '/api/TeachSalary/EditTeachSalaryGroup',
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json; charset=utf-8'
//       },
//       data: JSON.stringify(params)
//     }).then(res => {
//       resolve(res.data)
//     })
//   })
// }
// export const deleteTeachSalaryGroup = params => {
//   return new Promise((resolve, reject) => {
//     axios({
//       url: payrollUrl + '/api/TeachSalary/DeleteTeachSalaryGroup',
//       method: 'post',
//       data: qs.stringify(params)
//     }).then(res => {
//       resolve(res.data)
//     })
//   })
// }
// export const excelFilePreview = params => {
//   return new Promise((resolve, reject) => {
//     axios({
//       url: payrollUrl + '/api/TeachSalary/ExcelFilePreview',
//       method: 'post',
//       data: params
//     }).then(res => {
//       resolve(res.data)
//     })
//   })
// }
// export const getMonthHistory = params => {
//   return new Promise((resolve, reject) => {
//     axios({
//       url:
//         payrollUrl + '/api/TeachSalary/GetMonthHistory?' + qs.stringify(params),
//       method: 'get',
//       data: qs.stringify(params)
//     }).then(res => {
//       resolve(res.data)
//     })
//   })
// }
// 申请流程
export const apply = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: processCenterUrl + '/api/FlowRecord/Apply',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
//  处理节点
export const dealNode = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: processCenterUrl + '/api/FlowRecord/DealNode',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 驳回节点
export const rejectNode = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl + '/api/FlowRecord/RejectNode?' + qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 驳回到根节点
export const rejectRootNode = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl +
        '/api/FlowRecord/RejectRootNode?' +
        qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 获取处理中的流程
export const pageMyPendingDeal = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl +
        '/api/FlowRecord/PageMyPendingDeal?' +
        qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 获取我的流程
export const pageMyRecord = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl +
        '/api/FlowRecord/PageMyRecord?' +
        qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 获取处理过的流程
export const pageMyHasDeal = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl +
        '/api/FlowRecord/PageMyHasDeal?' +
        qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据id获取详情
export const item = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: processCenterUrl + '/api/FlowRecord/Item?' + qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据flowrecordid读取所有节点
export const recordNodeByFlowRecordId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl +
        '/api/FlowRecord/RecordNodeByFlowRecordId?' +
        qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据flowrecordid读取所有操作日志
export const recordOperateLogByFlowRecordId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl +
        '/api/FlowRecord/RecordOperateLogByFlowRecordId?' +
        qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据id取消流程
export const cancel = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: processCenterUrl + '/api/FlowRecord/Cancel?' + qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 获取流程
export const listBySchoolId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl + '/api/Flow/ListBySchoolId?' + qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据流程id读取节点
export const listByFlowId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl + '/api/FlowNode/ListByFlowId?' + qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const myPowerApplyFlow = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        processCenterUrl + '/api/Flow/MyPowerApplyFlow?' + qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
