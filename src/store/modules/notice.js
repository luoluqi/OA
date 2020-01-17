import {
  getSchoolGradeList,
  getSchoolClassList,
  sendNotice,
  getMyNoticeList,
  getNoticeList,
  delNotice,
  editNotice,
  addNoticeReadRecord,
  addNotice,
  getReadTeacherList
} from '@/api/noticeApi'
const notice = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    GetSchoolGradeList ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getSchoolGradeList(params).then(res => {
          resolve(res)
        })
      })
    },
    GetSchoolClassList ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getSchoolClassList(params).then(res => {
          resolve(res)
        })
      })
    },
    SendNotice ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        sendNotice(params).then(res => {
          resolve(res)
        })
      })
    },
    GetMyNoticeList ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getMyNoticeList(params).then(res => {
          resolve(res)
        })
      })
    },
    GetNoticeList ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getNoticeList(params).then(res => {
          resolve(res)
        })
      })
    },
    DelNotice ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        delNotice(params).then(res => {
          resolve(res)
        })
      })
    },
    EditNotice ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        editNotice(params).then(res => {
          resolve(res)
        })
      })
    },
    AddNoticeReadRecord ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        addNoticeReadRecord(params).then(res => {
          resolve(res)
        })
      })
    },
    AddNotice ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        addNotice(params).then(res => {
          resolve(res)
        })
      })
    },
    GetReadTeacherList ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getReadTeacherList(params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
export default notice
