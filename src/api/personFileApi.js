import axios from './axios'
import qs from 'qs'
import {personFileUrl, uploadUrl} from '@/config/config'
export const getFolderList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/GetPersonalFolderList',
            method: 'get',
            params: params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const addFolder = (data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/AddPersonalFolder',
            method: 'post',
            data
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const editFolder = (data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/EditPersonalFolder',
            method: 'post',
            data
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const delFolder = (id) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/DelPersonalFolder/' + id,
            method: 'post'
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const getFileById = (id) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/GetPersonalfile/' + id,
            method: 'get'
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const delFile = (data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/DelPersonalFile',
            method: 'post',
            data:  qs.stringify(data)
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const addFile = (data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/AddPersonalFile',
            method: 'post',
            data
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const editFile = (data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/EditPersonalFile',
            method: 'post',
            data
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const getFileList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/GetPersonalFileList',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const uploadAttachment = (data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/UploadPersonalFileAttachment',
            method: 'post',
            data
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const delAttachment = (data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: personFileUrl + '/api/PersonalFile/DeletePersonalFileAttachment',
            method: 'post',
            data: qs.stringify(data)
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const uploadFile = (formData) => {
    return new Promise((resolve, reject) => {
        axios.post(
            uploadUrl, 
            formData, 
            { 
                headers: { "Content-Type": "multipart/form-data" }
            }
        ).then(res => {
            resolve(res.data) 
        })
            
    })
}