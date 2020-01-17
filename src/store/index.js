
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import common from './modules/common'
import demo from './modules/demo'
import email from './modules/email'
import interflow from './modules/interflow'
import notice from './modules/notice'
import note from './modules/note'
import file from './modules/file'
import payroll from './modules/payroll'
import workLog from './modules/workLog'
import schedule from './modules/schedule'
import workFlow from './modules/workFlow'
import processCenter from './modules/processCenter'
import form from './modules/form'
import organization from './modules/organization'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    demo,
    interflow,
    notice,
    email,
    note,
    file,
    payroll,
    workLog,
    schedule,
    workFlow,
    form,
    organization,
    processCenter
  },
  getters
})
export default store
