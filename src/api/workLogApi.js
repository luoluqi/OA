import axios from './axios'
import qs from 'qs'
import {workLogUrl, payrollUrl} from '@/config/config'

export const getTree = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: payrollUrl + '/api/TeachSalary/GetTeachDept',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const addWorkLog = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/AddWorkLog',
            method: 'post',
            data: params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const editWorkLog = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/EditWorkLog',
            method: 'post',
            data: params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const delWorkLog = (id) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/DeleteWorkLog/' + id,
            method: 'post'
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const getWorkLogList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/GetWorklogs',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}


export const addAttach = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/AddWorkLogAttachment',
            method: 'post',
            data: params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const delAttach = (id) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/DeleteWorkLogAttachment/' + id,
            method: 'post'
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const uploadFile = (formData) => {
    return new Promise((resolve, reject) => {
        axios.post(
            workLogUrl + '/api/WorkLog/UploadFile', 
            formData, 
            { 
                headers: { "Content-Type": "multipart/form-data" }
            }
        ).then(res => {
            resolve(res.data) 
        })
            
    })
}

export const getCommentList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/GetWorklogcommentList',
            method: 'get',
            params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const addComment = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/AddWorkLogComment',
            method: 'post',
            data: params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const delComment = (id) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/DeleteWorkLogComment/' + id,
            method: 'post'
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const addShared = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/AddSharedWorkLog',
            method: 'post',
            data: params
        }).then(res => {
          resolve(res.data)
        })
    })
}

export const delShared = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: workLogUrl + '/api/WorkLog/DeleteSharedWorkLog',
            method: 'post',
            data: qs.stringify(params)
        }).then(res => {
          resolve(res.data)
        })
    })
}