import axios from './axios'
import qs from 'qs'
import {addressBookUrl} from '@/config/config'

export const getDept = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: addressBookUrl + '/api/AddressBook/GetSchoolDeptModelList',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const getTeacherList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: addressBookUrl + '/api/AddressBook/GetTeacherListByDept',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const getTeacher = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: addressBookUrl + '/api/AddressBook/GetTeacher',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const getTeacherByName = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: addressBookUrl + '/api/AddressBook/GetTeacherByName',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}
