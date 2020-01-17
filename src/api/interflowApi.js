import axios from './axios'
import qs from 'qs'
import {baseUrl, baseUrl2} from '@/config/config'
import {schoolYear, schoolTerm, schoolGrades, schoolClasses, schoolList, scoreList, scoreTable} from '@/mock/demoMock'
export const getYear = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: baseUrl + '/api/Examination/GetSchoolYears',
            method: 'get',
            data: qs.stringify(params)
        }).then(res => {
          resolve(res.data)
        })
        // resolve(schoolYear)
    })
}
export const getTerm = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: baseUrl + '/api/Examination/GetTerm?data=' + JSON.stringify(params),
            method: 'get',
            data: qs.stringify(params)
        }).then(res => {
          resolve(res.data)
        })
        // resolve(schoolTerm)
    })
}
export const getGrades = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: baseUrl + '/api/Examination/GetGrades?data=' + JSON.stringify(params),
            method: 'get',
            data: qs.stringify(params)
        }).then(res => {
          resolve(res.data)
        })
        // resolve(schoolGrades)
    })
}
export const getClasses = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: baseUrl + '/api/Examination/GetClasses?data=' + JSON.stringify(params),
            method: 'get',
            data: qs.stringify(params)
        }).then(res => {
          resolve(res.data)
        })
        // resolve(schoolClasses)
    })
}
export const getList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: baseUrl + '/api/Examination/GetList?data=' + JSON.stringify(params),
            method: 'get',
            data: qs.stringify(params)
        }).then(res => {
          resolve(res.data)
        })
        // resolve(schoolList)
    })
}

export const getSubject = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl + '/api/Examination/GetSubject?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
      // resolve(schoolList)
  })
}

export const editSubject = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl + '/api/Examination/Edit?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
      // resolve(schoolList)
  })
}

export const saveSubject = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl + '/api/Examination/Save?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
      // resolve(schoolList)
  })
}

export const delSubject = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl + '/api/Examination/Delete?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
      // resolve(schoolList)
  })
}
export const deleteLists = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl + '/api/Examination/DeleteLists?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
      // resolve(schoolList)
  })
}

export const getScoreList = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: baseUrl + '/api/Examination/GetStuScoreList?data=' + JSON.stringify(params),
            method: 'get',
            data: qs.stringify(params)
        }).then(res => {
          resolve(res.data)
        })
        // resolve(scoreList)
    })
}

export const inputStuScoreEdit = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl + '/api/Examination/InputStuScoreEdit?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
      // resolve(scoreList)
  })
}

export const saveStuScore = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl + '/api/Examination/SaveStuScore',
          method: 'post',
          // headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
      // resolve(scoreList)
  })
}

export const getQueryScoreList = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl + '/api/Examination/GetQueryScoreList?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
      // resolve(scoreList)
  })
}

export const getQueryScoreView = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl + '/api/Examination/GetQueryScoreView?data=' + JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      })
      // resolve(scoreList)
  })
}

export const getScoreTable = (params) => {
    return new Promise((resolve, reject) => {
        // axios({
        //     url: baseUrl + '/Teacher/ExamManage/GetList',
        //     method: 'get',
        //     data: qs.stringify(params)
        // }).then(res => {
        //   resolve(res.data)
        // })
        resolve(scoreTable)
    })
}

export const queryScore = (params) => {
    return new Promise((resolve, reject) => {
        // axios({
        //     url: baseUrl + '/Teacher/ExamManage/GetList',
        //     method: 'get',
        //     data: qs.stringify(params)
        // }).then(res => {
        //   resolve(res.data)
        // })
        resolve({data: 98, success: true, message: '获取成功98分'})
    })
}

export const addPoint = (params) => {
  return new Promise((resolve, reject) => {
      axios({
          url: baseUrl2 + '/api/Point/AddPoint?data='+ JSON.stringify(params),
          method: 'get',
          data: qs.stringify(params)
      }).then(res => {
          resolve(res.data)
      })
  })
}
