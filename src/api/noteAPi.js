import axios from './axios'
import qs from 'qs'
import {noteUrl} from '@/config/config'
// 根据创建人Id获取标签列表
export const getNoteList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: noteUrl+'/api/Note/GetNoteList',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}
// 新增标签
export const addNote = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: noteUrl+'/api/Note/AddNote',
          method: 'post',
          data: params
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 根据Id删除标签
export const delNote = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: noteUrl+'/api/Note/DelNote?'+ qs.stringify(params),
          method: 'post'
      }).then(res => {
        resolve(res.data)
      })
  })
}
// 根据Id删除标签
export const updateNote = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: noteUrl+'/api/Note/UpdateNote',
          method: 'post',
          data: params
      }).then(res => {
        resolve(res.data)
      })
  })
}
