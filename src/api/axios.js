import axios from 'axios'
import store from '@/store'
import router from '../router'
import Vue from 'vue'
import {getCookiesObj} from '@/util/tool.js'
import {Encrypt} from '@/util/crypto'
import {getCookie} from '@/util/tool'
axios.defaults.timeout = 5000
axios.defaults.withCredentials = false // 跨域请求，允许保存cookie
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
	// 签名
	config.headers['sign'] = Encrypt(new Date().getTime())
	config.headers['Token'] = getCookie('Token') 
	// config.headers['Token'] = '90f96d81'
  if (store.getters.cookieStart&&store.getters.cookieStart.Token!='undefined') {
    config.headers['loginName'] = store.getters.cookieStart.loginName 
    config.headers['roleCode'] = store.getters.cookieStart.roleCode 
   
	}
	return config
}, function (error) {
	console.log('error' + error)
	return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
	var data = response.data
	if(typeof data == 'string'){
		data = JSON.parse(data)
	}
	if(data.status == 500){
		Vue.prototype.$message.error(data.msg)
	}
	return response
}, function (error) {
	switch(error.response.status){
		case 302:
			Vue.prototype.$message.error('状态：302，登录过期，请重新登陆')
			 location.href = 'http://www.xueerqin.net'
		break
		case 401:
			Vue.prototype.$message.error('状态：401')
		break
		case 500:
			Vue.prototype.$message.error('状态：500,服务器出错了')
		break
	}
	return Promise.reject(new Error('服务器君开小差了，请稍后再试'))
})
export default axios
