import {getNoteList, addNote, delNote, updateNote} from '@/api/noteApi'
const note = {
    namespaced: true,
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
      GetNoteList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getNoteList(params).then(res => {
                resolve(res)
            })
        })
      },
      AddNote ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          addNote(params).then(res => {
                resolve(res)
            })
        })
      },
      DelNote ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          delNote(params).then(res => {
                resolve(res)
            })
        })
      },
      UpdateNote ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          updateNote(params).then(res => {
                resolve(res)
            })
        })
      }
    }
}
export default note
