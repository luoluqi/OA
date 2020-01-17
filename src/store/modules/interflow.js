import {getYear, getTerm, getGrades, getClasses, getList, 
  getSubject, editSubject, saveSubject, delSubject, getScoreList, inputStuScoreEdit, saveStuScore, getQueryScoreList, getQueryScoreView,
  getScoreTable, queryScore, deleteLists, addPoint} from '@/api/interflowApi'
const interflow = {
    namespaced: true,
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
      GetYear ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getYear(params).then(res => {
                resolve(res)
            })
        })
      },
      GetTerm ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
            getTerm(params).then(res => {
                resolve(res)
            })
        })
      },
      GetGrades ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
            getGrades(params).then(res => {
                resolve(res)
            })
        })
      },
      GetClasses ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
            getClasses(params).then(res => {
                resolve(res)
            })
        })
      },
      GetList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
            getList(params).then(res => {
                resolve(res)
            })
        })
      },
      GetSubject ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getSubject(params).then(res => {
                resolve(res)
            })
        })
      },
      EditSubject ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          editSubject(params).then(res => {
                resolve(res)
            })
        })
      },
      SaveSubject ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          saveSubject(params).then(res => {
                resolve(res)
            })
        })
      },
      DelSubject ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          delSubject(params).then(res => {
                resolve(res)
            })
        })
      },
      DeleteLists ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          deleteLists(params).then(res => {
                resolve(res)
            })
        })
      },
      GetScoreList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getScoreList(params).then(res => {
                resolve(res)
            })
        })
      },
      InputStuScoreEdit ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          inputStuScoreEdit(params).then(res => {
                resolve(res)
            })
        })
      },
      SaveStuScore ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          saveStuScore(params).then(res => {
                resolve(res)
            })
        })
      },
      GetQueryScoreList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getQueryScoreList(params).then(res => {
                resolve(res)
            })
        })
      },
      GetQueryScoreView ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getQueryScoreView(params).then(res => {
                resolve(res)
            })
        })
      },
      GetScoreTable ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getScoreTable(params).then(res => {
                resolve(res)
            })
        })
      },
      QueryScore ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          queryScore(params).then(res => {
                resolve(res)
            })
        })
      },
      AddPoint ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          addPoint(params).then(res => {
                resolve(res)
            })
        })
      }
    }
}
export default interflow
