import {
  add, update, deleteById, pageBySchoolId, listBySchoolId, itemById, 
  addFormField, updateFormField, deleteByIdFormField, listByTableIdFormField,
  applyFormRecord, updateRecordValueFormRecord, itemByRecordIdFormRecord, 
  saveItemFormType, deleteByIdFormType, pageBySchoolIdFormType, listBySchoolIdFormType} from '@/api/formApi'
  const form = {
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
      DeleteById ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          deleteById(params).then(res => {
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
      ListBySchoolId ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          listBySchoolId(params).then(res => {
            resolve(res)
          })
        })
      },
      ItemById ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          itemById(params).then(res => {
            resolve(res)
          })
        })
      },
      AddFormField ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          addFormField(params).then(res => {
            resolve(res)
          })
        })
      },
      UpdateFormField ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          updateFormField(params).then(res => {
            resolve(res)
          })
        })
      },
      DeleteByIdFormField ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          deleteByIdFormField(params).then(res => {
            resolve(res)
          })
        })
      },
      ListByTableIdFormField ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          listByTableIdFormField(params).then(res => {
            resolve(res)
          })
        })
      },
      ApplyFormRecord ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          applyFormRecord(params).then(res => {
            resolve(res)
          })
        })
      },
      UpdateRecordValueFormRecord ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          updateRecordValueFormRecord(params).then(res => {
            resolve(res)
          })
        })
      },
      ItemByRecordIdFormRecord ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          itemByRecordIdFormRecord(params).then(res => {
            resolve(res)
          })
        })
      },
      SaveItemFormType ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          saveItemFormType(params).then(res => {
            resolve(res)
          })
        })
      },
      DeleteByIdFormType ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          deleteByIdFormType(params).then(res => {
            resolve(res)
          })
        })
      },
      PageBySchoolIdFormType ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          pageBySchoolIdFormType(params).then(res => {
            resolve(res)
          })
        })
      },
      ListBySchoolIdFormType ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          listBySchoolIdFormType(params).then(res => {
            resolve(res)
          })
        })
      }
    }
  }
  export default form
  