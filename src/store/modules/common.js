import {
  getArrIndex,
  reqFullScreen,
  exitFullScreen,
  getCookiesObj,
  setCookie
} from '@/util/tool'
import { getTokenByPC } from '@/api/commonApi'
const common = {
  namespaced: true,
  state: {
    isCollapse: false,
    tagList: JSON.parse(sessionStorage.getItem('tagList')) || [],
    tag: JSON.parse(sessionStorage.getItem('tag')) || {},
    isFullScreen: false,
    // 页面缓存配置
    keepAlive: [],
    keepAlivePage: ['Page', 'Auth'],
    keepAlivePath: ['/item/page', '/item/auth'],
    cookieStr:
      'username=school_edu; loginName=school_edu; roleCode=SchoolAdmin; Token=1c4e55a5',
    // cookieStr: '',
    cookieStart: {},
    // cookiesObj: { schoolId: 'eeeea2b869e44b3bbd797f4d781aceaf' },
    cookiesObj: null
  },
  getters: {},
  mutations: {
    SET_COLLAPSE (state, params) {
      state.isCollapse = !state.isCollapse
    },
    ADD_TAG (state, params) {
      state.tag = params
      sessionStorage.setItem('tag', JSON.stringify(params))
      // console.log(state.tagList)
      state.tagList.forEach((item, index, array) => {
        if (item.value === params.value) {
          state.tagList[index].query = params.query
        }
      })
      var bool = state.tagList.some((item, index, array) => {
        return item.value == params.value
      })
      if (bool) {
        return false
      } else {
        state.tagList.push(params)
        sessionStorage.setItem('tagList', JSON.stringify(state.tagList))
      }
    },
    CLOSE_TAG (state, params) {
      var i = getArrIndex(state.tagList, params.value)
      state.tagList.splice(i, 1)
      sessionStorage.setItem('tagList', JSON.stringify(state.tagList))
    },
    CLEAR_TAG (state, params) {
      state.tagList = []
      sessionStorage.setItem('tagList', JSON.stringify(state.tagList))
      state.tag = {}
      sessionStorage.setItem('tag', JSON.stringify(state.tag))
    },
    KEEP_ALIVE (state, params) {
      state.keepAlive = params
    },
    SET_FULL_SCREEN (state, params) {
      state.isFullScreen = !state.isFullScreen
      if (state.isFullScreen) {
        reqFullScreen()
        state.isCollapse = true
      } else {
        exitFullScreen()
        state.isCollapse = false
      }
    },
    CLOSE_ALL_TAG (state, params) {
      state.tagList = []
      sessionStorage.setItem('tagList', JSON.stringify(state.tagList))
    },
    GET_COOKIE (state, params) {
      if (document.cookie != '') {
        state.cookiesObj = getCookiesObj(document.cookie)
      }
    }
  },
  actions: {
    GgetTokenByPC ({ state, commit, dispatch }) {
      if (document.cookie != '') {
        state.cookieStart = getCookiesObj(document.cookie)
      } else {
        state.cookieStart = getCookiesObj(state.cookieStr)
        setCookie('Token', state.cookieStart.Token, 0)
        setCookie('loginName', state.cookieStart.loginName, 0)
        setCookie('roleCode', state.cookieStart.roleCode, 0)
      }
      return new Promise((resolve, reject) => {
        var params = {
          Token: state.cookieStart.Token,
          roleCode: state.cookieStart.roleCode
        }
        // if (state.cookiesObj) {
        //   resolve()
        //   return
        // }
        getTokenByPC(params)
          .then(res => {
            var result = JSON.parse(res)
            // console.log(result)
            if (result.Code == 200) {
              var strData = result.Data
              // console.log(strData)
              if (strData) {
                setCookie('img', strData.Img, 0)
                setCookie('loginUserId', strData.UserId, 0)
                setCookie('teacherId', strData.SelfId, 0)
                setCookie('realName', strData.RealName, 0)
                // setCookie('studentId', strData.ClassInfoList[0].SelfId, 0)
                // setCookie('classId', strData.ClassInfoList[0].ClassId, 0)
                setCookie('schoolId', strData.SchoolId, 0)
                // setCookie('gradeId', strData.ClassInfoList[0].GradeId, 0)
                // state.cookiesObj = getCookiesObj(document.cookie)
                state.cookiesObj = {
                  Token: state.cookieStart.Token,
                  roleCode: state.cookieStart.roleCode,
                  img: strData.Img,
                  loginName: strData.LoginName,
                  loginUserId: strData.UserId,
                  realName: encodeURI(strData.RealName),
                  schoolId: strData.SchoolId,
                  teacherId: strData.SelfId
                }
                // console.log(state.cookiesObj)
              } else {
                // location.href = 'http://www.xueerqin.net'
              }
            }
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default common
