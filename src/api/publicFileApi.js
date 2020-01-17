import axios from './axios'
import qs from 'qs'
import {publicFileUrl, uploadUrl} from '@/config/config'

export const getFolder = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: publicFileUrl + '/api/PublicFile/GetPublicgeneralfolder',
            method: 'get',
            params: params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const getFolderList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: publicFileUrl + '/api/PublicFile/GetPublicFolderList',
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
            url: publicFileUrl + '/api/PublicFile/AddPublicFolder',
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
            url: publicFileUrl + '/api/PublicFile/EditPublicFolder',
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
            url: publicFileUrl + '/api/PublicFile/DelPublicFolder/' + id,
            method: 'post'
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const getFileById = (id) => {
    return new Promise((resolve, reject) => {
        axios({
            url: publicFileUrl + '/api/PublicFile/GetPublicFile/' + id,
            method: 'get'
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const delFile = (data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: publicFileUrl + '/api/PublicFile/DelPublicFile',
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
            url: publicFileUrl + '/api/PublicFile/AddPublicFile',
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
            url: publicFileUrl + '/api/PublicFile/EditPublicFile',
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
            url: publicFileUrl + '/api/PublicFile/GetPublicFileList',
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
            url: publicFileUrl + '/api/PublicFile/UploadPublicFileAttachment',
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
            url: publicFileUrl + '/api/PublicFile/DeletePublicFileAttachment',
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

export const getRoot = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: publicFileUrl + '/api/PublicFile/GetPublicgeneralfolderList',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const addRoot = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: publicFileUrl + '/api/PublicFile/AddPublicGeneralFolder',
            method: 'post',
            data: params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const editRoot = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: publicFileUrl + '/api/PublicFile/EditPublicGeneralFolder',
            method: 'post',
            data: params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const delRoot = (id) => {
    return new Promise((resolve, reject) => {
        axios({
            url: publicFileUrl + '/api/PublicFile/DelPublicGeneralFolder/' + id,
            method: 'post' 
        }).then(res => {
          resolve(res.data)
        })
    })
}