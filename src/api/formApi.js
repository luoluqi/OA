import axios from './axios'
import qs from 'qs'
import { oaForm } from '@/config/config'
// Form
// 新增表单
export const add = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/Form/Add',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 修改表单内容,字段新增修改删除不在这里操作,调用额外的接口
export const update = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/Form/Update',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据id删除表单
export const deleteById = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/Form/DeleteById?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据学校id类型id分页获取数据
export const pageBySchoolId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/Form/PageBySchoolId?data=' + JSON.stringify(params),
      method: 'get',
      params
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据学校id分类id获取数据 不分页
export const listBySchoolId = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/Form/ListBySchoolId?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据id获取详情
export const itemById = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/Form/ItemById?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// FormField
// 新增某个表单的字段
export const addFormField = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/FormField/Add',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
};
// 修改某个表单的字段
export const updateFormField = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/FormField/Update',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据id删除字段
export const deleteByIdFormField = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/FormField/DeleteById?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据tableid读取此表单所有的字段
export const listByTableIdFormField = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaForm + '/api/FormField/ListByTableId?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// FormRecord
// 填写保存表单记录
export const applyFormRecord = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/FormRecord/Apply',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 修改某个申请表单的字段值
export const updateRecordValueFormRecord = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/FormRecord/UpdateRecordValue',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据记录id获取申请详情
export const itemByRecordIdFormRecord = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaForm +
        '/api/FormRecord/ItemByRecordId?data=' +
        JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// FormType
// 添加或者修改某个类型
export const saveItemFormType = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/FormType/SaveItem',
      method: 'post',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 添加或者修改某个类型
export const deleteByIdFormType = params => {
  return new Promise((resolve, reject) => {
    axios({
      url: oaForm + '/api/FormType/DeleteById?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据学校id上级分类id分页获取数据
export const pageBySchoolIdFormType = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaForm + '/api/FormType/PageBySchoolId?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
// 根据学校id上级分类id获取数据 不分页
export const listBySchoolIdFormType = params => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        oaForm + '/api/FormType/ListBySchoolId?data=' + JSON.stringify(params),
      method: 'get',
      data: qs.stringify(params)
    }).then(res => {
      resolve(res.data)
    })
  })
}
