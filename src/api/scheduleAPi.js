import axios from './axios'
import qs from 'qs'
import { scheduleUrl } from '@/config/config'
// 根据学校Id， 登录id 获取日程列表
export const getScheduleList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: scheduleUrl + '/api/Schedule/GetScheduleList',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

// 无参数 请求事件类型列表
export const getEventList = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: scheduleUrl + '/api/Schedule/GetEventList',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 无参数 请求事务类型列表
export const getTransactionList = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: scheduleUrl + '/api/Schedule/GetTransactionList',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}

// 添加日程事件
export const addSchedule = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: scheduleUrl + '/api/Schedule/AddSchedule?' + qs.stringify(params),
          method: 'post'
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 获取日程事件编辑信息
export const getScheduleEdit = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: scheduleUrl + '/api/Schedule/EditSchedule?' + qs.stringify(params),
          method: 'post'
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 删除日程
export const deleteSchedule = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: scheduleUrl + '/api/Schedule/DeleteSchedule?' + qs.stringify(params),
          method: 'post'
      }).then(res => {
        resolve(res.data)
      })
  })
}
