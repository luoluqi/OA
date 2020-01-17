import {
  areaList, areaPage, schoolListByAreaId, schoolPageByAreaId, deptListBySchoolId,
  deptPageBySchoolId, teacherListBySchoolId, teacherListByDeptId, deptListByTeacherId
} from '@/api/organizationApi'
  const organization = {
    namespaced: true,
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
      AreaList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          areaList(params).then(res => {
            resolve(res)
          })
        })
      },
      AreaPage ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          areaPage(params).then(res => {
            resolve(res)
          })
        })
      },
      SchoolListByAreaId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          schoolListByAreaId(params).then(res => {
            resolve(res)
          })
        })
      },
      SchoolPageByAreaId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          schoolPageByAreaId(params).then(res => {
            resolve(res)
          })
        })
      },
      DeptListBySchoolId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          deptListBySchoolId(params).then(res => {
            resolve(res)
          })
        })
      },
      DeptPageBySchoolId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          deptPageBySchoolId(params).then(res => {
            resolve(res)
          })
        })
      },
      TeacherListBySchoolId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          teacherListBySchoolId(params).then(res => {
            resolve(res)
          })
        })
      },
      TeacherListByDeptId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          teacherListByDeptId(params).then(res => {
            resolve(res)
          })
        })
      },
      DeptListByTeacherId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          deptListByTeacherId(params).then(res => {
            resolve(res)
          })
        })
      }
    }
  }
  export default organization
