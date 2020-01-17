import { getScheduleList, getEventList, getTransactionList, addSchedule, getScheduleEdit, deleteSchedule } from '@/api/scheduleApi'
const schedule = {
    namespaced: true,
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
      GetSchedule ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getScheduleList(params).then(res => {
                resolve(res)
            })
        })
      },

      GetEventList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getEventList(params).then(res => {
                resolve(res)
            })
        })
      },

      GetTransactionList ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getTransactionList(params).then(res => {
                resolve(res)
            })
        })
      },

      AddSchedule ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          addSchedule(params).then(res => {
                resolve(res)
            })
        })
      },

      GetScheduleEdit ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          getScheduleEdit(params).then(res => {
                resolve(res)
            })
        })
      },
      DeleteSchedule ({state, commit, dispatch}, params) {
        return new Promise((resolve, reject) => {
          deleteSchedule(params).then(res => {
                resolve(res)
            })
        })
      }
    }
}
export default schedule
