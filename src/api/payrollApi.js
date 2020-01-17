import axios from './axios'
import qs from 'qs'
import { payrollUrl } from '@/config/config'
export const getTeachDept = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        payrollUrl +
        '/api/TeachSalary/GetTeachDept?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const getTeachSalaryGroupList = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        payrollUrl +
        '/api/TeachSalary/GetTeachSalaryGroupList?' +
        qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const addTeachSalaryGroup = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: payrollUrl + '/api/TeachSalary/AddTeachSalaryGroup',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const editTeachSalaryGroup = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: payrollUrl + '/api/TeachSalary/EditTeachSalaryGroup',
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      data: JSON.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const deleteTeachSalaryGroup = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: payrollUrl + '/api/TeachSalary/DeleteTeachSalaryGroup',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const getTeachSalaryFiles = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        payrollUrl +
        '/api/TeachSalary/GetTeachSalaryFiles?' +
        qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const addTeachSalaryFile = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: payrollUrl + '/api/TeachSalary/AddTeachSalaryFile',
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: params
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export const getTeachsalarydetaileds = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        payrollUrl +
        '/api/TeachSalary/GetTeachsalarydetaileds?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const excelFilePreview = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: payrollUrl + '/api/TeachSalary/ExcelFilePreview',
      method: 'post',
      data: params
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const getMonthHistory = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        payrollUrl + '/api/TeachSalary/GetMonthHistory?' + qs.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
export const checkExcel = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: payrollUrl + '/api/TeachSalary/CheckExcel',
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: params
    }).then(res => {
      resolve(res.data)
    })
  })
}
