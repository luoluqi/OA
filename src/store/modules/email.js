import {getDeptList, getDeptByUserList, getEmilType, upload, addEmil, getEmailStatusList, getEmilList, getTeachDeptV2, getEmilListV2,
editMailDelait, delEmail, upEmailReadStatus, download, delMailReceiving, getMailReceivingList, upIsReadEmailReadStatusList,delEmailreceiving} from '@/api/emailApi'
const email = {
    namespaced: true,
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
      GetDeptList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getDeptList(params).then(res => {
                resolve(res)
            })
        })
      },
      GetDeptByUserList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getDeptByUserList(params).then(res => {
                resolve(res)
            })
        })
      },
      GetEmilType ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getEmilType(params).then(res => {
                resolve(res)
            })
        })
      },
      Upload ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          upload(params).then(res => {
                resolve(res)
            })
        })
      },
      AddEmil ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          addEmil(params).then(res => {
                resolve(res)
            })
        })
      },
      GetEmailStatusList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getEmailStatusList(params).then(res => {
                resolve(res)
            })
        })
      },
      GetEmilList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getEmilList(params).then(res => {
                resolve(res)
            })
        })
      },
      GetEmilListV2 ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getEmilListV2(params).then(res => {
                resolve(res)
            })
        })
      },
      EditMailDelait ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          editMailDelait(params).then(res => {
                resolve(res)
            })
        })
      },
      DelEmail ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          delEmail(params).then(res => {
                resolve(res)
            })
        })
      },
      UpEmailReadStatus ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          upEmailReadStatus(params).then(res => {
                resolve(res)
            })
        })
      },
      Download ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          download(params).then(res => {
                resolve(res)
            })
        })
      },
      DelMailReceiving ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          delMailReceiving(params).then(res => {
                resolve(res)
            })
        })
      },
      GetMailReceivingList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getMailReceivingList(params).then(res => {
                resolve(res)
            })
        })
      },
      UpIsReadEmailReadStatusList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          upIsReadEmailReadStatusList(params).then(res => {
                resolve(res)
            })
        })
      },
      DelEmailreceiving ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          delEmailreceiving(params).then(res => {
                resolve(res)
            })
        })
      },
      GetTeachDeptV2 ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getTeachDeptV2(params).then(res => {
                resolve(res)
            })
        })
      }
      // GetLoginParent ({state, commit, dispatch}, params) {
      //   return new Promise((resolve, reject) => {
      //     getLoginParent(params).then(res => {
      //           resolve(res)
      //       })
      //   })
      // },
      // GetLoginTeacher ({state, commit, dispatch}, params) {
      //   return new Promise((resolve, reject) => {
      //     getLoginTeacher(params).then(res => {
      //           resolve(res)
      //       })
      //   })
      // },
      // GetMChild ({state, commit, dispatch}, params) {
      //   return new Promise((resolve, reject) => {
      //     getMChild(params).then(res => {
      //           resolve(res)
      //       })
      //   })
      // },
      // GetParams ({state, commit, dispatch}, params) {
      //   return new Promise((resolve, reject) => {
      //     getParams(params).then(res => {
      //           resolve(res)
      //       })
      //   })
      // },
      // GetStuDetail ({state, commit, dispatch}, params) {
      //   return new Promise((resolve, reject) => {
      //     getStuDetail(params).then(res => {
      //           resolve(res)
      //       })
      //   })
      // }
    }
}
export default email
