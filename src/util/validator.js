// 校验手机号码
export const validPhone = (rule, value, callback) => {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  if (!value) {
      callback(new Error('请输入手机号码'))
  } else if (!reg.test(value)) {
      callback(new Error('请输入正确的11位手机号码'))
  } else {
      callback()
  }
}
// 校验IP地址
export const validIp = (rule, value, callback) => {
    const reg = /(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/
    if (!value) {
        callback(new Error('请输入ip地址'))
    } else if (!reg.test(value)) {
        callback(new Error('请输入正确的ip地址'))
    } else {
        callback()
    }
  }
// 校验数字
export const validNum = (rule, value, callback) => {
    const reg = /^\d+$/
    if (!value && value != 0) {
        callback(new Error('请输入数字'))
    } else if (!reg.test(value)) {
        callback(new Error('请输入正整数'))
    } else if (value > 1000) {
        callback(new Error('不能超过1000'))
    } else {
        callback()
    }
}
