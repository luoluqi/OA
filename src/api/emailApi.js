import axios from './axios'
import qs from 'qs'
import {emailUrl, payrollUrl} from '@/config/config'
// 获取部门列表
export const getDeptList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: emailUrl + '/api/Email/GetDeptList?data=' + JSON.stringify(params),
            method: 'get',
            data: qs.stringify(params)
        }).then(res => {
          resolve(res.data)
        })
    })
}
// 获取部门下的员工列表
export const getDeptByUserList = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/GetDeptByUserList?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 邮件类型
export const getEmilType = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/GetEmilType?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 邮件类型
export const upload = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/Upload?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 邮件类型
export const addEmil = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          // url: emailUrl + '/api/Email/AddEmil?' + qs.stringify(params),
          url: emailUrl + '/api/Email/AddEmil',
          // headers: { 'content-type': 'multipart/form-data' },
          method: 'post',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 获取邮件数量列表
export const getEmailStatusList = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/GetEmailStatusList?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 获取邮件数据列表
export const getEmilList = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/GetEmilList?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 获取邮件数据删除列表
export const getEmilListV2 = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/GetEmilListV2?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 编辑邮件
export const editMailDelait = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/EditMailDelait?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 删除邮件
export const delEmail = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/DelEmail?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 更新邮件标识已读未读
export const upEmailReadStatus = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/UpEmailReadStatusV2?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 更新邮件标识已读未读
export const download = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/Download?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 删除附件
export const delMailReceiving = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/DelMailReceiving/' + params.id,
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 获取收件列表
export const getMailReceivingList = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/GetMailReceivingList?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 全部标识为已读
export const upIsReadEmailReadStatusList = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/UpIsReadEmailReadStatusList?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 删除收件箱邮件
export const delEmailreceiving = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: emailUrl + '/api/Email/DelEmailreceiving?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
//获取部门人员树
export const getTeachDeptV2 = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: payrollUrl + '/api/TeachSalary/GetTeachDeptV2?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
  })
}
// export const getLoginParent = (params) => {
//   return new Promise((resolve, reject) => {
//       axios({
//           url: emailUrl + '/api/Email/GetLoginParent',
//           method: 'get',
//           data: qs.stringify(params)
//       }).then(res => {
//         resolve(res.data)
//       })
//   })
// }
// export const getLoginTeacher = (params) => {
//   return new Promise((resolve, reject) => {
//       axios({
//           url: emailUrl + '/api/Email/GetLoginTeacher',
//           method: 'get',
//           data: qs.stringify(params)
//       }).then(res => {
//         resolve(res.data)
//       })
//   })
// }
// export const getMChild = (params) => {
//   return new Promise((resolve, reject) => {
//       axios({
//           url: emailUrl + '/api/Email/GetMChild',
//           method: 'get',
//           data: qs.stringify(params)
//       }).then(res => {
//         resolve(res.data)
//       })
//   })
// }
// export const getParams = (params) => {
//   return new Promise((resolve, reject) => {
//       axios({
//           url: emailUrl + '/api/Email/GetParams',
//           method: 'get',
//           data: qs.stringify(params)
//       }).then(res => {
//         resolve(res.data)
//       })
//   })
// }
// export const getStuDetail = (params) => {
//   return new Promise((resolve, reject) => {
//       axios({
//           url: emailUrl + '/api/Email/GetStuDetail',
//           method: 'get',
//           data: qs.stringify(params)
//       }).then(res => {
//         resolve(res.data)
//       })
//   })
// }
