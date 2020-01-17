import axios from './axios'
import qs from 'qs'
import { oaDept } from '@/config/config'
// 地区---根据父级id获取地区集合(不分页 )
export const areaList = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaDept + '/api/Organization/AreaList?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 地区---根据父级id获取地区集合(分页)
export const areaPage = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaDept + '/api/Organization/AreaPage?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 学校---根据地区id获取此区域下学校(不分页)
export const schoolListByAreaId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaDept +
        '/api/Organization/SchoolListByAreaId?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 学校---根据地区id获取此区域下学校(分页)
export const schoolPageByAreaId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaDept +
        '/api/Organization/SchoolPageByAreaId?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 部门--根据学校id,部门上级id获取部门集合(不分页)
export const deptListBySchoolId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaDept +
        '/api/Organization/DeptListBySchoolId?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 部门--根据学校id,部门上级id获取部门集合(不分页)
export const deptPageBySchoolId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaDept +
        '/api/Organization/DeptPageBySchoolId?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 老师---根据学校id获取此学校所有老师
export const teacherListBySchoolId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaDept +
        '/api/Organization/TeacherListBySchoolId?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 老师---根据部门id获取此学校所有老师
export const teacherListByDeptId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaDept +
        '/api/Organization/TeacherListByDeptId?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据teacherid获取部门
export const deptListByTeacherId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaDept +
        '/api/Organization/DeptListByTeacherId?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
