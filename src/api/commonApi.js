import axios from './axios'
import qs from 'qs'
import {baseUrl2} from '@/config/config'
export const getTokenByPC = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: baseUrl2 + '/api/Token/GetTokenByPC?data=' + JSON.stringify(params),
            method: 'get',
            data: qs.stringify(params)
        }).then(res => {
          resolve(res.data)
        }).catch(error => {
          // location.href = 'http://www.xueerqin.net'
          reject(error)
        })
    })
}

export const getTree = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl2 + '/api/TreeNode/GetTree',
          method: 'get',
          params
      }).then(res => {
        resolve(res.data)
      })
  })
}
