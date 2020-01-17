import {
  getTeachSalaryGroupList,
  addTeachSalaryGroup,
  getTeachDept,
  editTeachSalaryGroup,
  deleteTeachSalaryGroup,
  getTeachSalaryFiles,
  getTeachsalarydetaileds,
  addTeachSalaryFile,
  excelFilePreview,
  getMonthHistory,
  checkExcel
} from '@/api/payrollApi'
const payroll = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    GetTeachDept ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getTeachDept(params).then(res => {
          resolve(res)
        })
      })
    },
    GetTeachSalaryGroupList ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getTeachSalaryGroupList(params).then(res => {
          resolve(res)
        })
      })
    },
    AddTeachSalaryGroup ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        addTeachSalaryGroup(params).then(res => {
          resolve(res)
        })
      })
    },
    EditTeachSalaryGroup ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        editTeachSalaryGroup(params).then(res => {
          resolve(res)
        })
      })
    },
    DeleteTeachSalaryGroup ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        deleteTeachSalaryGroup(params).then(res => {
          resolve(res)
        })
      })
    },
    GetTeachSalaryFiles ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getTeachSalaryFiles(params).then(res => {
          resolve(res)
        })
      })
    },
    GetTeachsalarydetaileds ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getTeachsalarydetaileds(params).then(res => {
          resolve(res)
        })
      })
    },
    AddTeachSalaryFile ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        addTeachSalaryFile(params).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    ExcelFilePreview ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        excelFilePreview(params).then(res => {
          resolve(res)
        })
      })
    },
    GetMonthHistory ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        getMonthHistory(params).then(res => {
          resolve(res)
        })
      })
    },
    CheckExcel ({ state, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        checkExcel(params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
export default payroll
